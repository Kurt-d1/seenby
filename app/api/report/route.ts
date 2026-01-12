import { NextRequest, NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { PDFReport } from "@/lib/pdf-report"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessName, businessAddress, score, directories } = body

    const pdfBuffer = await renderToBuffer(
      PDFReport({
        businessName,
        businessAddress,
        score,
        directories
      })
    )

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=seenby-report.pdf"
      }
    })

  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}