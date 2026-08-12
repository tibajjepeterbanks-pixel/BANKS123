import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * POST /api/papers/upload
 * Upload a new past paper (admin only)
 *
 * Accepts multipart/form-data with:
 * - college: string
 * - school: string
 * - courseCode: string
 * - courseName: string
 * - year: string (1-4)
 * - semester: string (1-2)
 * - academicYear: string (YYYY/YYYY format)
 * - file: File (PDF only, max 10MB)
 */

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(auth);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // Verify user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const college = formData.get('college') as string;
    const school = formData.get('school') as string;
    const courseCode = formData.get('courseCode') as string;
    const courseName = formData.get('courseName') as string;
    const year = formData.get('year') as string;
    const semester = formData.get('semester') as string;
    const academicYear = formData.get('academicYear') as string;
    const file = formData.get('file') as File;

    // Validation
    if (!college || !school || !courseCode || !courseName || !year || !semester || !academicYear) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Validate academic year format
    if (!/^\d{4}\/\d{4}$/.test(academicYear)) {
      return NextResponse.json(
        { error: 'Academic year must be in format YYYY/YYYY' },
        { status: 400 }
      );
    }

    // Validate year and semester
    if (!['1', '2', '3', '4'].includes(year)) {
      return NextResponse.json(
        { error: 'Year must be between 1 and 4' },
        { status: 400 }
      );
    }

    if (!['1', '2'].includes(semester)) {
      return NextResponse.json(
        { error: 'Semester must be 1 or 2' },
        { status: 400 }
      );
    }

    // Find or create college
    let collegeRecord = await prisma.college.findFirst({
      where: { code: college },
    });

    if (!collegeRecord) {
      collegeRecord = await prisma.college.create({
        data: {
          name: college,
          code: college,
          description: `${college} at Makerere University`,
        },
      });
    }

    // Find or create school
    let schoolRecord = await prisma.school.findFirst({
      where: {
        collegeId: collegeRecord.id,
        name: school,
      },
    });

    if (!schoolRecord) {
      schoolRecord = await prisma.school.create({
        data: {
          name: school,
          code: school.toLowerCase().replace(/\s+/g, '-'),
          collegeId: collegeRecord.id,
        },
      });
    }

    // Find or create course
    let courseRecord = await prisma.course.findFirst({
      where: {
        code: courseCode,
        year: parseInt(year),
        semester: parseInt(semester),
      },
    });

    if (!courseRecord) {
      courseRecord = await prisma.course.create({
        data: {
          code: courseCode,
          name: courseName,
          collegeId: collegeRecord.id,
          schoolId: schoolRecord.id,
          year: parseInt(year),
          semester: parseInt(semester),
          credits: 3, // Default credits
        },
      });
    }

    // Save file to disk
    const uploadDir = join(process.cwd(), 'public', 'uploads', academicYear, courseCode);
    
    // Ensure directory exists
    try {
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
    } catch (err) {
      console.error('Error creating directory:', err);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${courseCode}_${academicYear.replace('/', '_')}_${timestamp}.pdf`;
    const filePath = join(uploadDir, fileName);

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Create paper record
    const paper = await prisma.paper.create({
      data: {
        courseId: courseRecord.id,
        academicYear,
        fileName: file.name,
        fileSize: file.size,
        pages: 0, // Would be extracted from PDF in production
        fileUrl: `/uploads/${academicYear}/${courseCode}/${fileName}`,
        uploadedBy: user.id,
      },
    });

    // Create upload record
    const paperUpload = await prisma.paperUpload.create({
      data: {
        userId: user.id,
        fileName: file.name,
        fileSize: file.size,
        status: 'COMPLETED',
      },
    });

    // Create audit log
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await prisma.auditLog.create({
      data: {
        action: 'PAPER_UPLOADED',
        entity: 'Paper',
        entityId: paper.id,
        userId: user.id,
        ipAddress: clientIp,
        userAgent,
        newValues: {
          courseCode,
          courseName,
          academicYear,
          fileName: file.name,
          fileSize: file.size,
        },
      },
    });

    // Create notification for admins
    const admins = await prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'SUPERADMIN'],
        },
      },
    });

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: 'Paper Uploaded',
          message: `New paper uploaded: ${courseCode} - ${courseName} (${academicYear})`,
          type: 'UPLOAD',
          relatedId: paper.id,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Paper uploaded successfully',
        paper: {
          id: paper.id,
          courseCode,
          courseName,
          academicYear,
          fileName: file.name,
          fileSize: file.size,
          fileUrl: paper.fileUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Paper upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error during file upload' },
      { status: 500 }
    );
  }
}

/**
 * API Response Examples:
 *
 * SUCCESS (201):
 * {
 *   "success": true,
 *   "message": "Paper uploaded successfully",
 *   "paper": {
 *     "id": "clv123...",
 *     "courseCode": "CSC2101",
 *     "courseName": "Database Systems",
 *     "academicYear": "2024/2025",
 *     "fileName": "Database_Systems_2024.pdf",
 *     "fileSize": 2048000,
 *     "fileUrl": "/uploads/2024_2025/CSC2101/CSC2101_2024_2025_1723749000000.pdf"
 *   }
 * }
 *
 * ERROR - Invalid file type (400):
 * {
 *   "error": "Only PDF files are allowed"
 * }
 *
 * ERROR - File too large (400):
 * {
 *   "error": "File size must be less than 10MB"
 * }
 *
 * ERROR - Missing fields (400):
 * {
 *   "error": "Missing required fields"
 * }
 *
 * ERROR - Unauthorized (403):
 * {
 *   "error": "Unauthorized - Admin access required"
 * }
 */
