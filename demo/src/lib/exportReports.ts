export type ReportRow = Record<string, string | number | boolean | null | undefined>

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

function rowsToCsv(rows: ReportRow[]) {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const headerLine = headers.join(',')
  const valueLines = rows.map((row) =>
    headers
      .map((header) => {
        const rawValue = row[header] ?? ''
        const value = String(rawValue).replace(/"/g, '""')
        return /[",\n]/.test(value) ? `"${value}"` : value
      })
      .join(','),
  )
  return [headerLine, ...valueLines].join('\r\n')
}

function rowsToHtmlTable(rows: ReportRow[]) {
  if (!rows.length) {
    return '<table><tr><td>Sin datos</td></tr></table>'
  }

  const headers = Object.keys(rows[0])
  const th = headers.map((header) => `<th>${header}</th>`).join('')
  const tr = rows
    .map((row) => {
      const cells = headers
        .map((header) => `<td>${String(row[header] ?? '')}</td>`)
        .join('')
      return `<tr>${cells}</tr>`
    })
    .join('')

  return `<table border="1" cellspacing="0" cellpadding="6"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`
}

function sanitizePdfText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}

function buildSimplePdf(title: string, rows: ReportRow[]) {
  const headers = rows.length ? Object.keys(rows[0]) : []
  const lines: string[] = [title]

  if (!rows.length) {
    lines.push('Sin datos para exportar.')
  } else {
    lines.push(headers.join(' | '))
    rows.forEach((row) => {
      const rowText = headers.map((header) => String(row[header] ?? '')).join(' | ')
      lines.push(rowText)
    })
  }

  const maxLines = 44
  const visibleLines = lines.slice(0, maxLines)
  if (lines.length > maxLines) {
    visibleLines.push(`... ${lines.length - maxLines} filas adicionales no mostradas en esta hoja.`)
  }

  const textOps = visibleLines
    .map((line, index) => {
      const y = 770 - index * 16
      return `BT /F1 10 Tf 40 ${y} Td (${sanitizePdfText(line)}) Tj ET`
    })
    .join('\n')

  const contentStream = `${textOps}\n`

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    `5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`,
  ]

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = [0]

  for (const object of objects) {
    offsets.push(pdf.length)
    pdf += object
  }

  const xrefStart = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  offsets.slice(1).forEach((offset) => {
    pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`
  })

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`
  return pdf
}

export function exportCsvReport(rows: ReportRow[], baseName: string) {
  const csv = rowsToCsv(rows)
  const fileName = `${safeFileName(baseName)}_${new Date().toISOString().slice(0, 10)}.csv`
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, fileName)
}

export function exportExcelReport(rows: ReportRow[], baseName: string) {
  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
      </head>
      <body>
        ${rowsToHtmlTable(rows)}
      </body>
    </html>
  `
  const fileName = `${safeFileName(baseName)}_${new Date().toISOString().slice(0, 10)}.xls`
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  downloadBlob(blob, fileName)
}

export function exportPdfReport(rows: ReportRow[], baseName: string, title: string) {
  const pdf = buildSimplePdf(title, rows)
  const fileName = `${safeFileName(baseName)}_${new Date().toISOString().slice(0, 10)}.pdf`
  const blob = new Blob([pdf], { type: 'application/pdf' })
  downloadBlob(blob, fileName)
}
