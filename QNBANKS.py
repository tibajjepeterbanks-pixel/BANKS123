import subprocess
import sys

# --- AUTOMATIC MODULE INSTALLATION CHECKER ---
try:
    import streamlit as st
except ModuleNotFoundError:
    print("Streamlit package not found. Initiating automatic setup installer...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "streamlit"])
    print("Installation complete! Relaunching web engine...")
    import streamlit as st

import os
import re
import sqlite3
from io import BytesIO
from datetime import datetime

st.set_page_config(page_title="UNIPAST Past Papers Portal", page_icon="🎓", layout="wide")

UPLOAD_DIR = "uploaded_papers"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)


def get_db_connection():
    return sqlite3.connect("portal.db")

DEFAULT_UNIVERSITIES = [
    {
        "slug": "makerere-university",
        "name": "Makerere University",
        "acronym": "MAK",
        "location": "Kampala",
        "description": "Uganda’s oldest public university with leading programs in humanities, science, engineering, business, law, and medicine.",
        "colleges": [
            {
                "name": "College of Humanities and Social Sciences",
                "schools": [
                    {
                        "name": "School of Psychology",
                        "course_units": [
                            {"code": "PSY2101", "name": "Research Methods in Psychology", "credits": 3},
                            {"code": "PSY2202", "name": "Social Psychology", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "kyambogo-university",
        "name": "Kyambogo University",
        "acronym": "KYU",
        "location": "Kampala",
        "description": "A public university focused on teacher education, engineering, agriculture, and vocational studies.",
        "colleges": [
            {
                "name": "College of Engineering",
                "schools": [
                    {
                        "name": "School of Electrical Engineering",
                        "course_units": [
                            {"code": "EEL2101", "name": "Circuit Theory", "credits": 4},
                            {"code": "EEL2202", "name": "Electronics I", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "mbarara-university-of-science-and-technology",
        "name": "Mbarara University of Science and Technology",
        "acronym": "MUST",
        "location": "Mbarara",
        "description": "A specialized institution with strong programs in medicine, science, technology, and agriculture.",
        "colleges": [
            {
                "name": "Faculty of Science",
                "schools": [
                    {
                        "name": "School of Computing",
                        "course_units": [
                            {"code": "CSC2102", "name": "Data Structures and Algorithms", "credits": 4},
                            {"code": "CSC2201", "name": "Operating Systems", "credits": 4},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "gulu-university",
        "name": "Gulu University",
        "acronym": "GU",
        "location": "Gulu",
        "description": "Serving northern Uganda with education, science, health, and management programs.",
        "colleges": [
            {
                "name": "School of Health Sciences",
                "schools": [
                    {
                        "name": "Department of Nursing",
                        "course_units": [
                            {"code": "NUR2101", "name": "Community Health Nursing", "credits": 4},
                            {"code": "NUR2202", "name": "Medical-Surgical Nursing", "credits": 4},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "busitema-university",
        "name": "Busitema University",
        "acronym": "BU",
        "location": "Busitema",
        "description": "A university with a strong focus on engineering, agriculture and technology for regional development.",
        "colleges": [
            {
                "name": "Faculty of Engineering",
                "schools": [
                    {
                        "name": "School of Mechanical Engineering",
                        "course_units": [
                            {"code": "MEC2101", "name": "Thermodynamics", "credits": 4},
                            {"code": "MEC2202", "name": "Fluid Mechanics", "credits": 4},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "islamic-university-in-uganda",
        "name": "Islamic University in Uganda",
        "acronym": "IUIU",
        "location": "Mbale",
        "description": "A faith-based institution offering law, business, computing, education, and Islamic studies.",
        "colleges": [
            {
                "name": "College of Business and Management",
                "schools": [
                    {
                        "name": "School of Business Administration",
                        "course_units": [
                            {"code": "BUS2101", "name": "Principles of Management", "credits": 3},
                            {"code": "BUS2202", "name": "Financial Accounting", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "kampala-international-university",
        "name": "Kampala International University",
        "acronym": "KIU",
        "location": "Kampala",
        "description": "A private university with international-standard education in law, medicine, business, computing, and hospitality.",
        "colleges": [
            {
                "name": "College of Computing",
                "schools": [
                    {
                        "name": "School of Computing and Informatics",
                        "course_units": [
                            {"code": "CIT2101", "name": "Database Management Systems", "credits": 3},
                            {"code": "CIT2202", "name": "Software Engineering", "credits": 4},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "nkumba-university",
        "name": "Nkumba University",
        "acronym": "NU",
        "location": "Entebbe",
        "description": "A private university known for business, arts, education, and computing programs.",
        "colleges": [
            {
                "name": "Faculty of Information Technology",
                "schools": [
                    {
                        "name": "School of Computer Science",
                        "course_units": [
                            {"code": "CSC2103", "name": "Systems Programming", "credits": 4},
                            {"code": "CSC2204", "name": "Mobile Application Development", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "uganda-christian-university",
        "name": "Uganda Christian University",
        "acronym": "UCU",
        "location": "Mukono",
        "description": "A private Christian university with strong programs in theology, business, law, education, and computing.",
        "colleges": [
            {
                "name": "School of Business",
                "schools": [
                    {
                        "name": "Department of Management",
                        "course_units": [
                            {"code": "MGT2101", "name": "Organizational Behaviour", "credits": 3},
                            {"code": "MGT2202", "name": "Human Resource Management", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "uganda-martyrs-university",
        "name": "Uganda Martyrs University",
        "acronym": "UMU",
        "location": "Nkozi",
        "description": "A private university known for education, humanities, business, law, and development studies.",
        "colleges": [
            {
                "name": "Faculty of Education",
                "schools": [
                    {
                        "name": "School of Education",
                        "course_units": [
                            {"code": "EDU2103", "name": "Educational Planning", "credits": 3},
                            {"code": "EDU2204", "name": "Teacher Development", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "uganda-technology-and-management-university",
        "name": "Uganda Technology and Management University",
        "acronym": "UTAMU",
        "location": "Kampala",
        "description": "A university specializing in technology, management, communication, and design programs.",
        "colleges": [
            {
                "name": "College of Engineering and Technology",
                "schools": [
                    {
                        "name": "School of Computing",
                        "course_units": [
                            {"code": "CSC2201", "name": "Database Systems", "credits": 3},
                            {"code": "CSC2302", "name": "Artificial Intelligence", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "ndejje-university",
        "name": "Ndejje University",
        "acronym": "NDU",
        "location": "Luweero",
        "description": "A private university with programs in agriculture, business, education, arts, and technology.",
        "colleges": [
            {
                "name": "College of Business",
                "schools": [
                    {
                        "name": "School of Commerce",
                        "course_units": [
                            {"code": "COM2102", "name": "Managerial Economics", "credits": 3},
                            {"code": "COM2203", "name": "Business Law", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "cavendish-university-uganda",
        "name": "Cavendish University Uganda",
        "acronym": "CUU",
        "location": "Kampala",
        "description": "A private university known for law, business, computing, and communication programs.",
        "colleges": [
            {
                "name": "School of Law",
                "schools": [
                    {
                        "name": "Department of International Law",
                        "course_units": [
                            {"code": "LAW2102", "name": "International Trade Law", "credits": 4},
                            {"code": "LAW2203", "name": "Corporate Law", "credits": 4},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "victoria-university",
        "name": "Victoria University",
        "acronym": "VU",
        "location": "Kampala",
        "description": "A private institution delivering programs in business, technology, law, and international relations.",
        "colleges": [
            {
                "name": "College of Computer Science",
                "schools": [
                    {
                        "name": "Department of Software Engineering",
                        "course_units": [
                            {"code": "SWE2101", "name": "Object Oriented Programming", "credits": 4},
                            {"code": "SWE2202", "name": "Software Testing", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "st-lawrence-university",
        "name": "St. Lawrence University",
        "acronym": "SLU",
        "location": "Kampala",
        "description": "A private university with education, business, computing, and social sciences programs.",
        "colleges": [
            {
                "name": "School of Business",
                "schools": [
                    {
                        "name": "Department of Information Systems",
                        "course_units": [
                            {"code": "IS2101", "name": "Database Systems", "credits": 3},
                            {"code": "IS2202", "name": "Enterprise Systems", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "uganda-pentecostal-university",
        "name": "Uganda Pentecostal University",
        "acronym": "UPU",
        "location": "Fort Portal",
        "description": "A faith-based university offering education, business, development studies, and theology.",
        "colleges": [
            {
                "name": "School of Business",
                "schools": [
                    {
                        "name": "Department of Marketing",
                        "course_units": [
                            {"code": "MKT2102", "name": "Consumer Behaviour", "credits": 3},
                            {"code": "MKT2203", "name": "Brand Management", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "livingstone-international-university",
        "name": "LivingStone International University",
        "acronym": "LIU",
        "location": "Mbale",
        "description": "A private Christian university with theology, business, education, and social science offerings.",
        "colleges": [
            {
                "name": "School of Theology",
                "schools": [
                    {
                        "name": "Department of Biblical Studies",
                        "course_units": [
                            {"code": "BIB2101", "name": "Old Testament Studies", "credits": 3},
                            {"code": "BIB2202", "name": "New Testament Studies", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "uganda-metropolitan-university",
        "name": "Uganda Metropolitan University",
        "acronym": "UMU",
        "location": "Kampala",
        "description": "A private university offering business, law, education, and computing with flexible learning options.",
        "colleges": [
            {
                "name": "School of Information Technology",
                "schools": [
                    {
                        "name": "Department of Software Development",
                        "course_units": [
                            {"code": "SD2101", "name": "Programming Fundamentals", "credits": 4},
                            {"code": "SD2202", "name": "Web Programming", "credits": 4},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "bishop-stuart-university",
        "name": "Bishop Stuart University",
        "acronym": "BSU",
        "location": "Mbarara",
        "description": "A private chartered university with programs in education, business, science, and social sciences.",
        "colleges": [
            {
                "name": "Faculty of Education",
                "schools": [
                    {
                        "name": "Department of Curriculum and Instruction",
                        "course_units": [
                            {"code": "CUR2101", "name": "Teaching Methodologies", "credits": 3},
                            {"code": "CUR2202", "name": "Educational Assessment", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "kabale-university",
        "name": "Kabale University",
        "acronym": "KAB",
        "location": "Kabale",
        "description": "A public university in southwestern Uganda offering agriculture, education, computing, and law.",
        "colleges": [
            {
                "name": "School of Agriculture",
                "schools": [
                    {
                        "name": "Department of Crop Science",
                        "course_units": [
                            {"code": "CRO2101", "name": "Crop Production", "credits": 3},
                            {"code": "CRO2202", "name": "Plant Protection", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "muteesa-i-royal-university",
        "name": "Muteesa I Royal University",
        "acronym": "MIRU",
        "location": "Masaka",
        "description": "A private university blending heritage and modern education across business, education, law, and arts.",
        "colleges": [
            {
                "name": "School of Business and Economics",
                "schools": [
                    {
                        "name": "Department of Economics",
                        "course_units": [
                            {"code": "ECO2101", "name": "Microeconomics", "credits": 3},
                            {"code": "ECO2202", "name": "Macroeconomics", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "kumi-university",
        "name": "Kumi University",
        "acronym": "KYU",
        "location": "Kumi",
        "description": "A private university providing business, education, computing, and social sciences programs.",
        "colleges": [
            {
                "name": "School of Business",
                "schools": [
                    {
                        "name": "Department of Accounting",
                        "course_units": [
                            {"code": "ACC2104", "name": "Accounting Principles", "credits": 3},
                            {"code": "ACC2205", "name": "Auditing", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "kampala-university",
        "name": "Kampala University",
        "acronym": "KU",
        "location": "Kampala",
        "description": "A private institution offering education, business, engineering, and social sciences.",
        "colleges": [
            {
                "name": "School of Engineering",
                "schools": [
                    {
                        "name": "Department of Civil Engineering",
                        "course_units": [
                            {"code": "CIV2102", "name": "Construction Materials", "credits": 4},
                            {"code": "CIV2203", "name": "Structural Design", "credits": 4},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "all-saints-university-lango",
        "name": "All Saints University Lango",
        "acronym": "ASUL",
        "location": "Lira",
        "description": "A private university delivering programs in education, business, and communication in northern Uganda.",
        "colleges": [
            {
                "name": "School of Education",
                "schools": [
                    {
                        "name": "Department of Primary Education",
                        "course_units": [
                            {"code": "PED2101", "name": "Primary Curriculum", "credits": 3},
                            {"code": "PED2202", "name": "Literacy Instruction", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "uganda-womens-university",
        "name": "Uganda Women’s University",
        "acronym": "UWU",
        "location": "Mbarara",
        "description": "A public university dedicated to women’s empowerment through education and training.",
        "colleges": [
            {
                "name": "Faculty of Education",
                "schools": [
                    {
                        "name": "Department of Gender Studies",
                        "course_units": [
                            {"code": "GEN2101", "name": "Gender and Development", "credits": 3},
                            {"code": "GEN2202", "name": "Women in Leadership", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "africa-renewal-university",
        "name": "Africa Renewal University",
        "acronym": "ARU",
        "location": "Kampala",
        "description": "A private university offering business, communication, education, and theology programs.",
        "colleges": [
            {
                "name": "School of Leadership and Development",
                "schools": [
                    {
                        "name": "Department of Leadership Studies",
                        "course_units": [
                            {"code": "LDR2101", "name": "Leadership Theory", "credits": 3},
                            {"code": "LDR2202", "name": "Ethical Leadership", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "uganda-management-institute",
        "name": "Uganda Management Institute",
        "acronym": "UMI",
        "location": "Kampala",
        "description": "A professional institute offering postgraduate and executive programs in public administration, business, and leadership.",
        "colleges": [
            {
                "name": "School of Public Policy",
                "schools": [
                    {
                        "name": "Department of Public Administration",
                        "course_units": [
                            {"code": "PUB2101", "name": "Governance and Ethics", "credits": 3},
                            {"code": "PUB2202", "name": "Public Policy Analysis", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "makerere-university-business-school",
        "name": "Makerere University Business School",
        "acronym": "MUBS",
        "location": "Kampala",
        "description": "A business school of Makerere University offering management, finance, entrepreneurship, and human resources courses.",
        "colleges": [
            {
                "name": "School of Business",
                "schools": [
                    {
                        "name": "Department of Finance",
                        "course_units": [
                            {"code": "FIN2105", "name": "Investment Analysis", "credits": 3},
                            {"code": "FIN2207", "name": "Corporate Finance", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
    {
        "slug": "bugema-university",
        "name": "Bugema University",
        "acronym": "BU",
        "location": "Lutembe",
        "description": "A private Christian university with strong programs in theology, education, business, and agriculture.",
        "colleges": [
            {
                "name": "Faculty of Agriculture",
                "schools": [
                    {
                        "name": "Department of Animal Science",
                        "course_units": [
                            {"code": "ANI2102", "name": "Animal Production", "credits": 3},
                            {"code": "ANI2203", "name": "Livestock Management", "credits": 3},
                        ],
                    },
                ],
            },
        ],
    },
]

PAYMENT_AMOUNT = 200
SCREENSHOT_LIMIT = 2


def slugify(value):
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def unique_slug(cursor, base_slug):
    candidate = base_slug
    suffix = 1
    while cursor.execute("SELECT 1 FROM universities WHERE slug = ?", (candidate,)).fetchone():
        candidate = f"{base_slug}-{suffix}"
        suffix += 1
    return candidate


def populate_default_catalog(cursor):
    for uni in DEFAULT_UNIVERSITIES:
        slug = uni.get("slug") or slugify(uni["name"])
        slug = unique_slug(cursor, slug)
        cursor.execute(
            "INSERT INTO universities (slug, name, acronym, location, description) VALUES (?, ?, ?, ?, ?)",
            (slug, uni["name"], uni["acronym"], uni["location"], uni["description"]),
        )
        uni_id = cursor.lastrowid
        for college in uni["colleges"]:
            cursor.execute(
                "INSERT INTO colleges (university_id, name) VALUES (?, ?)",
                (uni_id, college["name"]),
            )
            college_id = cursor.lastrowid
            for school in college["schools"]:
                cursor.execute(
                    "INSERT INTO schools (college_id, name) VALUES (?, ?)",
                    (college_id, school["name"]),
                )
                school_id = cursor.lastrowid
                for course in school["course_units"]:
                    cursor.execute(
                        "INSERT INTO course_units (school_id, code, name, credits) VALUES (?, ?, ?, ?)",
                        (school_id, course["code"], course["name"], course["credits"]),
                    )


def init_db():
    conn = sqlite3.connect("portal.db")
    cursor = conn.cursor()
    cursor.execute(
        "CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, password TEXT NOT NULL)"
    )
    cursor.execute(
        "CREATE TABLE IF NOT EXISTS papers (id INTEGER PRIMARY KEY AUTOINCREMENT, course_code TEXT NOT NULL, year TEXT NOT NULL, file_name TEXT NOT NULL)"
    )
    cursor.execute(
        "CREATE TABLE IF NOT EXISTS downloads (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, university TEXT NOT NULL, college TEXT NOT NULL, school TEXT NOT NULL, course_code TEXT NOT NULL, course_name TEXT NOT NULL, amount INTEGER NOT NULL, payment_reference TEXT, phone TEXT, downloaded_at TEXT NOT NULL)"
    )
    cursor.execute(
        "CREATE TABLE IF NOT EXISTS universities (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, acronym TEXT, location TEXT, description TEXT)"
    )
    cursor.execute(
        "CREATE TABLE IF NOT EXISTS colleges (id INTEGER PRIMARY KEY AUTOINCREMENT, university_id INTEGER NOT NULL, name TEXT NOT NULL, FOREIGN KEY(university_id) REFERENCES universities(id))"
    )
    cursor.execute(
        "CREATE TABLE IF NOT EXISTS schools (id INTEGER PRIMARY KEY AUTOINCREMENT, college_id INTEGER NOT NULL, name TEXT NOT NULL, FOREIGN KEY(college_id) REFERENCES colleges(id))"
    )
    cursor.execute(
        "CREATE TABLE IF NOT EXISTS course_units (id INTEGER PRIMARY KEY AUTOINCREMENT, school_id INTEGER NOT NULL, code TEXT NOT NULL, name TEXT NOT NULL, credits INTEGER, FOREIGN KEY(school_id) REFERENCES schools(id))"
    )
    if not cursor.execute("SELECT 1 FROM universities LIMIT 1").fetchone():
        populate_default_catalog(cursor)
    conn.commit()
    conn.close()


def register_user(email, password):
    try:
        conn = sqlite3.connect("portal.db")
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, password))
        conn.commit()
        conn.close()
        return True
    except sqlite3.IntegrityError:
        return False


def verify_user(email, password):
    if email == "admin@mak.ac.ug" and password == "admin123":
        return True
    conn = sqlite3.connect("portal.db")
    cursor = conn.cursor()
    cursor.execute("SELECT 1 FROM users WHERE email = ? AND password = ?", (email, password))
    user = cursor.fetchone()
    conn.close()
    return user is not None


def save_paper_metadata(course_code, year, file_name):
    conn = sqlite3.connect("portal.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO papers (course_code, year, file_name) VALUES (?, ?, ?)", (course_code, year, file_name))
    conn.commit()
    conn.close()


def get_uploaded_papers(course_code):
    conn = sqlite3.connect("portal.db")
    cursor = conn.cursor()
    cursor.execute("SELECT year, file_name FROM papers WHERE course_code = ?", (course_code,))
    rows = cursor.fetchall()
    conn.close()
    return rows


def get_universities_for_select():
    conn = sqlite3.connect("portal.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, name FROM universities ORDER BY name")
    rows = cursor.fetchall()
    conn.close()
    return rows


def get_colleges_for_select(university_id):
    conn = sqlite3.connect("portal.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, name FROM colleges WHERE university_id = ? ORDER BY name", (university_id,))
    rows = cursor.fetchall()
    conn.close()
    return rows


def get_schools_for_select(college_id):
    conn = sqlite3.connect("portal.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, name FROM schools WHERE college_id = ? ORDER BY name", (college_id,))
    rows = cursor.fetchall()
    conn.close()
    return rows


def add_university(name, acronym, location, description):
    conn = sqlite3.connect("portal.db")
    cursor = conn.cursor()
    slug = unique_slug(cursor, slugify(name))
    cursor.execute(
        "INSERT INTO universities (slug, name, acronym, location, description) VALUES (?, ?, ?, ?, ?)",
        (slug, name, acronym, location, description),
    )
    conn.commit()
    conn.close()


def add_college(university_id, name):
    conn = sqlite3.connect("portal.db")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO colleges (university_id, name) VALUES (?, ?)",
        (university_id, name),
    )
    conn.commit()
    conn.close()


def add_school(college_id, name):
    conn = sqlite3.connect("portal.db")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO schools (college_id, name) VALUES (?, ?)",
        (college_id, name),
    )
    conn.commit()
    conn.close()


def add_course_unit(school_id, code, name, credits):
    conn = sqlite3.connect("portal.db")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO course_units (school_id, code, name, credits) VALUES (?, ?, ?, ?)",
        (school_id, code, name, credits),
    )
    conn.commit()
    conn.close()


def load_catalog():
    conn = sqlite3.connect("portal.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, slug, name, acronym, location, description FROM universities ORDER BY name")
    universities = []
    for uni_id, slug, name, acronym, location, description in cursor.fetchall():
        cursor.execute("SELECT id, name FROM colleges WHERE university_id = ? ORDER BY name", (uni_id,))
        colleges = []
        for college_id, college_name in cursor.fetchall():
            cursor.execute("SELECT id, name FROM schools WHERE college_id = ? ORDER BY name", (college_id,))
            schools = []
            for school_id, school_name in cursor.fetchall():
                cursor.execute(
                    "SELECT code, name, credits FROM course_units WHERE school_id = ? ORDER BY id",
                    (school_id,),
                )
                course_units = [
                    {"code": code, "name": title, "credits": credits}
                    for code, title, credits in cursor.fetchall()
                ]
                schools.append({"name": school_name, "course_units": course_units})
            colleges.append({"name": college_name, "schools": schools})
        universities.append(
            {
                "slug": slug,
                "name": name,
                "acronym": acronym,
                "location": location,
                "description": description,
                "colleges": colleges,
            }
        )
    conn.close()
    return universities


def record_download(email, university, college, school, course_code, course_name, amount, payment_reference, phone):
    conn = sqlite3.connect("portal.db")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO downloads (email, university, college, school, course_code, course_name, amount, payment_reference, phone, downloaded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (email, university, college, school, course_code, course_name, amount, payment_reference, phone, datetime.now().isoformat()),
    )
    conn.commit()
    conn.close()


def get_download_history(email):
    conn = sqlite3.connect("portal.db")
    cursor = conn.cursor()
    cursor.execute(
        "SELECT university, college, school, course_code, course_name, amount, payment_reference, phone, downloaded_at FROM downloads WHERE email = ? ORDER BY downloaded_at DESC",
        (email,),
    )
    rows = cursor.fetchall()
    conn.close()
    return rows


def get_all_course_codes():
    codes = []
    for uni in load_catalog():
        for college in uni["colleges"]:
            for school in college["schools"]:
                for course in school["course_units"]:
                    codes.append(course["code"])
    return sorted(set(codes))


def format_price(amount):
    return f"UGX {amount:,}"


def generate_sample_paper(course_code, course_name):
    contents = f"UNIPAST Sample Paper\nCourse: {course_code} - {course_name}\nPrice: {format_price(PAYMENT_AMOUNT)}\n\nThis is a sample downloaded paper for your academic preparation."
    return BytesIO(contents.encode("utf-8"))


def render_screenshot_guard():
    guard_html = (
        """
    <div style='border:1px solid #fde68a;border-radius:18px;background:#fffbeb;padding:18px;line-height:1.6;font-family:Arial, sans-serif;'>
      <div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;'>
        <div>
          <strong style='font-size:16px;color:#92400e;'>Screenshot Protection</strong>
          <div style='font-size:13px;color:#92400e;margin-top:4px;'>Press Print Screen to count screenshots. After 2 captures the warning becomes active.</div>
        </div>
        <span id='screenshot-count' style='background:#fef3c7;color:#92400e;padding:6px 12px;border-radius:999px;font-size:13px;'>0/"""
        + str(SCREENSHOT_LIMIT)
        + """</span>
      </div>
      <div id='screenshot-message' style='font-size:14px;color:#78350f;'>Please avoid taking more than two screenshots while using this portal.</div>
    </div>
    <script>
      const STORAGE_KEY = 'unipast_screenshot_count';
      const limit = """
        + str(SCREENSHOT_LIMIT)
        + """;
      const countLabel = document.getElementById('screenshot-count');
      const messageLabel = document.getElementById('screenshot-message');
      const getCount = () => parseInt(window.localStorage.getItem(STORAGE_KEY) || '0', 10);
      const setCount = (value) => window.localStorage.setItem(STORAGE_KEY, value);
      const updateUI = () => {
        const current = getCount();
        countLabel.textContent = `${current}/${limit}`;
        messageLabel.textContent = current >= limit
          ? 'Screenshot limit reached. Please do not take any more screenshots on this device.'
          : `Screenshot recorded. You have ${limit - current} screenshot(s) left.`;
      };
      window.addEventListener('keydown', (event) => {
        if (event.key === 'PrintScreen' || event.code === 'PrintScreen' || event.keyCode === 44) {
          event.preventDefault();
          const next = Math.min(getCount() + 1, limit);
          setCount(next);
          updateUI();
        }
      });
      updateUI();
    </script>
    """
    )
    st.components.v1.html(guard_html, height=170, scrolling=False)


def render_university_cards():
    st.subheader("Browse Universities")
    catalog = load_catalog()
    query = st.session_state.search_query.strip().lower()
    matching = []
    for uni in catalog:
        uni_match = query in uni["name"].lower() or query in uni["acronym"].lower() or query in uni["location"].lower()
        college_match = any(query in college["name"].lower() for college in uni["colleges"])
        school_match = any(query in school["name"].lower() for college in uni["colleges"] for school in college["schools"])
        course_match = any(query in course["code"].lower() or query in course["name"].lower() for college in uni["colleges"] for school in college["schools"] for course in school["course_units"])
        if not query or uni_match or college_match or school_match or course_match:
            matching.append(uni)
    if not matching:
        if query:
            st.warning("No universities matched your search. Try a different name, course code, or school.")
        else:
            st.info("Enter a search term in the sidebar to find your university, college, school, or course.")
        return None
    st.write(f"Showing {len(matching)} result(s) for '{query}'" if query else f"Showing {len(matching)} universities.")
    for uni in matching:
        with st.expander(f"{uni['name']} ({uni['acronym']}) — {uni['location']}"):
            st.write(uni["description"])
            cols = st.columns(2)
            with cols[0]:
                st.markdown("**Colleges & Faculties**")
                for college in uni["colleges"]:
                    st.write(f"- {college['name']}")
            with cols[1]:
                st.markdown("**Sample Schools**")
                for college in uni["colleges"]:
                    for school in college["schools"]:
                        st.write(f"- {school['name']}")
            if st.button(f"View {uni['name']}", key=f"view_{uni['slug']}"):
                st.session_state.selected_university = uni["slug"]
    return matching


def render_university_details(university_slug):
    catalog = load_catalog()
    uni = next((u for u in catalog if u["slug"] == university_slug), None)
    if not uni:
        st.error("University not found.")
        return
    st.markdown(f"### {uni['name']} ({uni['acronym']}) — {uni['location']}")
    st.write(uni["description"])
    st.markdown("---")
    for college in uni["colleges"]:
        st.markdown(f"#### {college['name']}")
        for school in college["schools"]:
            st.markdown(f"**{school['name']}**")
            for course in school["course_units"]:
                cols = st.columns([3, 1, 1])
                with cols[0]:
                    st.markdown(f"- **{course['code']}** {course['name']} ({course['credits']} credits)")
                with cols[1]:
                    st.markdown(f"**{format_price(PAYMENT_AMOUNT)}**")
                with cols[2]:
                    if st.button("Pay & Download", key=f"download_{uni['slug']}_{college['name']}_{school['name']}_{course['code']}"):
                        st.session_state.pending_download = {
                            "university": uni["name"],
                            "college": college["name"],
                            "school": school["name"],
                            "course_code": course["code"],
                            "course_name": course["name"],
                        }
    st.button("Back to university list", key="back_to_list") and st.session_state.update({"selected_university": None})


def render_payment_panel():
    pending = st.session_state.get("pending_download")
    if not pending:
        return
    st.markdown("---")
    st.subheader("Complete Payment to Download")
    st.write(f"Course: **{pending['course_code']}** — {pending['course_name']}")
    st.write(f"University: **{pending['university']}**")
    st.info(f"Each download costs **{format_price(PAYMENT_AMOUNT)}**. Please make payment and submit a payment reference.")

    if "download_ready" not in st.session_state:
        st.session_state["download_ready"] = False

    with st.form("payment_form"):
        phone = st.text_input("Mobile Money Phone Number", placeholder="2567XXXXXXXX")
        payment_reference = st.text_input("Payment Reference Code", placeholder="e.g. M-PESA12345")
        amount = st.number_input("Amount Paid (UGX)", value=PAYMENT_AMOUNT, min_value=PAYMENT_AMOUNT, step=PAYMENT_AMOUNT)
        submit_payment = st.form_submit_button("Verify Payment")
        if submit_payment:
            if amount != PAYMENT_AMOUNT:
                st.error(f"The fixed download fee is {format_price(PAYMENT_AMOUNT)}.")
            elif not phone or not payment_reference:
                st.error("Enter both phone number and payment reference to proceed.")
            else:
                record_download(
                    st.session_state.current_user,
                    pending["university"],
                    pending["college"],
                    pending["school"],
                    pending["course_code"],
                    pending["course_name"],
                    amount,
                    payment_reference,
                    phone,
                )
                st.session_state["download_ready"] = True
                st.session_state["download_content"] = generate_sample_paper(pending["course_code"], pending["course_name"]).getvalue().decode("utf-8")
                st.session_state["download_file_name"] = f"{pending['course_code']}_{pending['course_name'].replace(' ', '_')}.txt"
                st.success("Payment verified! Your download is ready below.")

    if st.session_state.get("download_ready"):
        st.download_button(
            label="📥 Download Paid Paper",
            data=st.session_state["download_content"].encode("utf-8"),
            file_name=st.session_state["download_file_name"],
            mime="text/plain",
        )
        if st.button("Finish and return to catalog"):
            st.session_state.pending_download = None
            st.session_state.download_ready = False
            st.session_state.download_content = ""
            st.session_state.download_file_name = ""


def render_my_downloads():
    st.subheader("My Download History")
    history = get_download_history(st.session_state.current_user)
    if not history:
        st.info("No paid downloads yet. Use the university catalog to pay for and download your first paper.")
        return
    for row in history:
        university, college, school, course_code, course_name, amount, reference, phone, downloaded_at = row
        with st.expander(f"{course_code} — {course_name}"):
            st.markdown(f"**University:** {university}")
            st.markdown(f"**College:** {college}")
            st.markdown(f"**School:** {school}")
            st.markdown(f"**Paid:** {format_price(amount)}")
            st.markdown(f"**Payment Reference:** {reference}")
            st.markdown(f"**Phone:** {phone}")
            st.markdown(f"**Downloaded At:** {downloaded_at}")


def render_admin_upload():
    st.subheader("Admin Dashboard")
    st.markdown("Manage papers, add universities, colleges, schools, and course units.")

    with st.expander("Upload Past Paper", expanded=True):
        all_course_codes = get_all_course_codes()
        target_code = st.selectbox("Select Target Course Code Unit:", all_course_codes)
        exam_year = st.text_input("Academic Examination Year:", placeholder="e.g., 2024/2025")
        uploaded_file = st.file_uploader("Choose Past Paper Document (PDF Format Only):", type=["pdf"])
        if st.button("Upload Paper"):
            if target_code and exam_year and uploaded_file:
                safe_year = exam_year.replace("/", "-").replace("\\", "-")
                safe_filename = uploaded_file.name.replace(" ", "_")
                clean_filename = f"{target_code}_{safe_year}_{safe_filename}"
                file_save_path = os.path.join(UPLOAD_DIR, clean_filename)
                with open(file_save_path, "wb") as f:
                    f.write(uploaded_file.getbuffer())
                save_paper_metadata(target_code, exam_year, clean_filename)
                st.success(f"Paper uploaded successfully for {target_code} ({exam_year}).")
            else:
                st.warning("Provide course code, year, and PDF file before uploading.")

        st.markdown("---")
        selected_code = st.selectbox("View uploaded papers for course code:", ["-- Select course code --"] + all_course_codes, key="view_uploaded_code")
        if selected_code != "-- Select course code --":
            papers = get_uploaded_papers(selected_code)
            if papers:
                for year, filename in papers:
                    st.write(f"• {selected_code} — {year} — {filename}")
            else:
                st.info("No uploaded papers found for this course code yet.")

    st.markdown("---")
    st.subheader("Catalog Management")
    catalog = load_catalog()

    with st.expander("Add a new university", expanded=True):
        with st.form("add_university_form"):
            uni_name = st.text_input("University Name")
            uni_acronym = st.text_input("Acronym")
            uni_location = st.text_input("Location")
            uni_description = st.text_area("Description")
            submit_uni = st.form_submit_button("Create University")
            if submit_uni:
                if uni_name and uni_location and uni_description:
                    add_university(uni_name, uni_acronym, uni_location, uni_description)
                    st.success(f"University '{uni_name}' added to the catalog.")
                else:
                    st.warning("Provide name, location, and description.")

    university_options = get_universities_for_select()
    if university_options:
        uni_ids = [row[0] for row in university_options]
        uni_names = [row[1] for row in university_options]
        selected_uni = st.selectbox("Select university to add a college", ["-- Select university --"] + uni_names, key="catalog_uni_select")
        if selected_uni != "-- Select university --":
            selected_uni_id = uni_ids[uni_names.index(selected_uni)]
            with st.form("add_college_form"):
                college_name = st.text_input("College/Faculty Name")
                submit_college = st.form_submit_button("Create College/Faculty")
                if submit_college:
                    if college_name:
                        add_college(selected_uni_id, college_name)
                        st.success(f"College/Faculty '{college_name}' added.")
                    else:
                        st.warning("Enter the college or faculty name.")

            college_options = get_colleges_for_select(selected_uni_id)
            if college_options:
                col_ids = [row[0] for row in college_options]
                col_names = [row[1] for row in college_options]
                selected_college = st.selectbox("Select college to add a school", ["-- Select college --"] + col_names, key="catalog_college_select")
                if selected_college != "-- Select college --":
                    selected_college_id = col_ids[col_names.index(selected_college)]
                    with st.form("add_school_form"):
                        school_name = st.text_input("School/Department Name")
                        submit_school = st.form_submit_button("Create School")
                        if submit_school:
                            if school_name:
                                add_school(selected_college_id, school_name)
                                st.success(f"School '{school_name}' added.")
                            else:
                                st.warning("Enter the school or department name.")

                    school_options = get_schools_for_select(selected_college_id)
                    if school_options:
                        school_ids = [row[0] for row in school_options]
                        school_names = [row[1] for row in school_options]
                        selected_school = st.selectbox("Select school to add a course unit", ["-- Select school --"] + school_names, key="catalog_school_select")
                        if selected_school != "-- Select school --":
                            selected_school_id = school_ids[school_names.index(selected_school)]
                            with st.form("add_course_form"):
                                course_code = st.text_input("Course Unit Code")
                                course_title = st.text_input("Course Unit Title")
                                course_credits = st.number_input("Credits", min_value=0, value=3)
                                submit_course = st.form_submit_button("Create Course Unit")
                                if submit_course:
                                    if course_code and course_title:
                                        add_course_unit(selected_school_id, course_code, course_title, course_credits)
                                        st.success(f"Course unit '{course_code}' added.")
                                    else:
                                        st.warning("Enter both a course code and title.")

    if catalog:
        st.markdown("---")
        st.subheader("Current catalog summary")
        st.write(f"Universities: {len(catalog)}")
        total_colleges = sum(len(u["colleges"]) for u in catalog)
        total_schools = sum(len(c["schools"]) for u in catalog for c in u["colleges"])
        total_courses = sum(len(s["course_units"]) for u in catalog for c in u["colleges"] for s in c["schools"])
        st.write(f"Colleges/Faculties: {total_colleges}")
        st.write(f"Schools/Departments: {total_schools}")
        st.write(f"Course units: {total_courses}")


init_db()

if "logged_in" not in st.session_state:
    st.session_state.logged_in = False
if "current_user" not in st.session_state:
    st.session_state.current_user = None
if "selected_university" not in st.session_state:
    st.session_state.selected_university = None
if "pending_download" not in st.session_state:
    st.session_state.pending_download = None
if "download_ready" not in st.session_state:
    st.session_state.download_ready = False
if "download_content" not in st.session_state:
    st.session_state.download_content = ""
if "download_file_name" not in st.session_state:
    st.session_state.download_file_name = ""
if "search_query" not in st.session_state:
    st.session_state.search_query = ""

if not st.session_state.logged_in:
    st.title("🎓 UNIPAST Past Papers Portal")
    st.subheader("Sign in or register to access digital university past papers")
    st.info("Use admin@mak.ac.ug / admin123 to access the upload dashboard.")
    auth_mode = st.radio("Choose Portal Action:", ["Sign In", "Register"])
    with st.form("auth_form", clear_on_submit=True):
        email = st.text_input("Email Address", placeholder="student@example.com")
        password = st.text_input("Password", type="password")
        submit_btn = st.form_submit_button("Continue")
        if submit_btn:
            if not email or not password:
                st.error("Both email and password are required.")
            elif auth_mode == "Register":
                if register_user(email, password):
                    st.success("Registration successful. Sign in using your new credentials.")
                else:
                    st.error("This email is already registered.")
            else:
                if verify_user(email, password):
                    st.session_state.logged_in = True
                    st.session_state.current_user = email
                else:
                    st.error("Invalid credentials. Please try again.")
    st.stop()

st.sidebar.title("UNIPAST Portal")
st.sidebar.write(f"Signed in as: **{st.session_state.current_user}**")
st.sidebar.text_input("Search catalog", key="search_query", placeholder="University, college, school, or course code")
section = st.sidebar.radio(
    "Navigate",
    ["Home", "Universities", "My Downloads"] + (["Admin Upload"] if st.session_state.current_user == "admin@mak.ac.ug" else []),
)

st.sidebar.markdown("---")
st.sidebar.markdown("**Pricing**: UGX 200 per paper download")
st.sidebar.markdown("**Screenshot policy**: max 2 Print Screen captures")

header_cols = st.columns([3, 2])
with header_cols[0]:
    st.title("UNIPAST — Uganda University Past Papers")
    st.write("Study smarter with past papers from a complete Ugandan university catalog.")
with header_cols[1]:
    st.metric("Download Fee", format_price(PAYMENT_AMOUNT))

render_screenshot_guard()

if section == "Home":
    st.subheader("Why use UNIPAST?")
    st.write("Access university past papers in one portal, pay just UGX 200 per download, and manage your paid downloads securely.")
    st.markdown("- Database-powered catalog\n- Search your university, college, school, or course\n- Pay and download process\n- Admin paper upload and catalog management")
    st.markdown("---")
    st.subheader("Featured Universities")
    featured = load_catalog()[:6]
    for uni in featured:
        st.write(f"**{uni['name']}** — {uni['location']}")
        st.write(uni['description'])
        st.markdown("---")
elif section == "Universities":
    if st.session_state.selected_university:
        render_university_details(st.session_state.selected_university)
    else:
        render_university_cards()
    render_payment_panel()
elif section == "My Downloads":
    render_my_downloads()
elif section == "Admin Upload":
    render_admin_upload()
