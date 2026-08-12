import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/papers
 * List papers with filtering and pagination
 *
 * Query parameters:
 * - college: string (optional) - Filter by college code
 * - courseCode: string (optional) - Filter by course code
 * - academicYear: string (optional) - Filter by academic year
 * - year: string (optional) - Filter by course year (1-4)
 * - semester: string (optional) - Filter by semester (1-2)
 * - search: string (optional) - Search by course code or name
 * - sort: 'newest' | 'mostViewed' | 'oldest' (default: newest)
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Get query parameters
    const college = searchParams.get('college');
    const courseCode = searchParams.get('courseCode');
    const academicYear = searchParams.get('academicYear');
    const year = searchParams.get('year');
    const semester = searchParams.get('semester');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));

    // Build where clause
    const where: any = {};

    if (college) {
      where.course = {
        college: {
          code: college,
        },
      };
    }

    if (courseCode) {
      where.course = {
        ...where.course,
        code: courseCode,
      };
    }

    if (academicYear) {
      where.academicYear = academicYear;
    }

    if (year) {
      where.course = {
        ...where.course,
        year: parseInt(year),
      };
    }

    if (semester) {
      where.course = {
        ...where.course,
        semester: parseInt(semester),
      };
    }

    if (search) {
      where.OR = [
        {
          course: {
            code: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          course: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // Build order by clause
    let orderBy: any = { createdAt: 'desc' };

    if (sort === 'mostViewed') {
      orderBy = { views: 'desc' };
    } else if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get total count
    const total = await prisma.paper.count({ where });

    // Get papers
    const papers = await prisma.paper.findMany({
      where,
      include: {
        course: {
          include: {
            college: true,
            school: true,
          },
        },
        uploader: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    });

    // Format response
    const formattedPapers = papers.map((paper) => ({
      id: paper.id,
      courseCode: paper.course.code,
      courseName: paper.course.name,
      college: paper.course.college.code,
      collegeName: paper.course.college.name,
      school: paper.course.school?.name,
      year: paper.course.year,
      semester: paper.course.semester,
      academicYear: paper.academicYear,
      fileName: paper.fileName,
      fileSize: paper.fileSize,
      pages: paper.pages,
      fileUrl: paper.fileUrl,
      views: paper.views,
      uploadedBy: paper.uploader?.name || 'Unknown',
      uploadedAt: paper.createdAt,
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        data: formattedPapers,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Papers list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/papers
 * Create a new paper (admin only) - Direct endpoint
 */

export async function POST(request: NextRequest) {
  try {
    // In production, verify admin role
    const body = await request.json();

    const { courseId, academicYear, fileName, fileSize, pages, fileUrl } = body;

    if (!courseId || !academicYear || !fileName || !fileSize || !fileUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Create paper
    const paper = await prisma.paper.create({
      data: {
        courseId,
        academicYear,
        fileName,
        fileSize,
        pages: pages || 0,
        fileUrl,
      },
      include: {
        course: {
          include: {
            college: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Paper created successfully',
        paper: {
          id: paper.id,
          courseCode: paper.course.code,
          courseName: paper.course.name,
          academicYear: paper.academicYear,
          fileName: paper.fileName,
          fileSize: paper.fileSize,
          fileUrl: paper.fileUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Paper creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * API Response Examples:
 *
 * GET SUCCESS (200):
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "clv123...",
 *       "courseCode": "CSC2101",
 *       "courseName": "Database Systems",
 *       "college": "CoCIS",
 *       "collegeName": "College of Computing and Information Sciences",
 *       "school": "Computer Science",
 *       "year": 2,
 *       "semester": 1,
 *       "academicYear": "2024/2025",
 *       "fileName": "Database_Systems_2024.pdf",
 *       "fileSize": 2048000,
 *       "pages": 45,
 *       "views": 324,
 *       "uploadedBy": "Admin Name",
 *       "uploadedAt": "2024-08-15T10:30:00Z"
 *     }
 *   ],
 *   "pagination": {
 *     "page": 1,
 *     "limit": 20,
 *     "total": 150,
 *     "totalPages": 8,
 *     "hasNextPage": true,
 *     "hasPrevPage": false
 *   }
 * }
 *
 * GET ERROR - No results (200):
 * {
 *   "success": true,
 *   "data": [],
 *   "pagination": {
 *     "page": 1,
 *     "limit": 20,
 *     "total": 0,
 *     "totalPages": 0,
 *     "hasNextPage": false,
 *     "hasPrevPage": false
 *   }
 * }
 */
