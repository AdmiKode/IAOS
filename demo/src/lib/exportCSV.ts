/**
 * Exporta un array de objetos como archivo CSV descargable.
 * @param data  Array de objetos planos
 * @param filename  Nombre del archivo sin extensión
 */
export function exportCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return
  const keys = Object.keys(data[0])
  const header = keys.join(',')
  const rows = data.map(row =>
    keys.map(k => {
      const val = row[k] ?? ''
      const str = String(val).replace(/"/g, '""')
      return str.includes(',') || str.includes('\n') || str.includes('"') ? `"${str}"` : str
    }).join(',')
  )
  const csv = [header, ...rows].join('\r\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
