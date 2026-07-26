from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.database.db import db
from app.dependencies.auth import admin_required

import csv
import io

router = APIRouter()


@router.get("/admin/results/export")
def export_results(

    current_user=Depends(admin_required)

):

    results = db["results"]

    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow([

        "Student ID",

        "Assessment ID",

        "Score",

        "Percentage",

        "Result"

    ])

    for item in results.find():

        writer.writerow([

            item.get("student_id"),

            item.get("assessment_id"),

            item.get("score"),

            item.get("percentage"),

            item.get("result")

        ])

    output.seek(0)

    return StreamingResponse(

        iter([output.getvalue()]),

        media_type="text/csv",

        headers={

            "Content-Disposition":

            "attachment; filename=results.csv"

        }

    )