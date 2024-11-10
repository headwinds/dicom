'use client'

import { useState } from 'react'
import dicomParser from 'dicom-parser'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle } from "lucide-react"

// Simplified DICOM dictionary based on dicom.ts structure
const simplifiedDictionary: { [key: string]: { name: string; vr: string } } = {
  '00080005': { name: 'Specific Character Set', vr: 'CS' },
  '00080016': { name: 'SOP Class UID', vr: 'UI' },
  '00080018': { name: 'SOP Instance UID', vr: 'UI' },
  '00080020': { name: 'Study Date', vr: 'DA' },
  '00080030': { name: 'Study Time', vr: 'TM' },
  '00080050': { name: 'Accession Number', vr: 'SH' },
  '00080060': { name: 'Modality', vr: 'CS' },
  '00080070': { name: 'Manufacturer', vr: 'LO' },
  '00080090': { name: 'Referring Physician\'s Name', vr: 'PN' },
  '0008103E': { name: 'Series Description', vr: 'LO' },
  '00100010': { name: 'Patient\'s Name', vr: 'PN' },
  '00100020': { name: 'Patient ID', vr: 'LO' },
  '00100030': { name: 'Patient\'s Birth Date', vr: 'DA' },
  '00100040': { name: 'Patient\'s Sex', vr: 'CS' },
  '0020000D': { name: 'Study Instance UID', vr: 'UI' },
  '0020000E': { name: 'Series Instance UID', vr: 'UI' },
  '00200010': { name: 'Study ID', vr: 'SH' },
  '00200011': { name: 'Series Number', vr: 'IS' },
  '00200013': { name: 'Instance Number', vr: 'IS' },
  '00280010': { name: 'Rows', vr: 'US' },
  '00280011': { name: 'Columns', vr: 'US' },
  '00280100': { name: 'Bits Allocated', vr: 'US' },
  '00280101': { name: 'Bits Stored', vr: 'US' },
  '00280102': { name: 'High Bit', vr: 'US' },
  '00280103': { name: 'Pixel Representation', vr: 'US' },
  '7FE00010': { name: 'Pixel Data', vr: 'OW' },
}

export function DicomParserSpa() {
  const [jsonInput, setJsonInput] = useState('')
  const [input, setInput] = useState<Int32Array | null>(null)
  const [parsedData, setParsedData] = useState<{ tag: string; name: string; value: string }[]>([])
  const [error, setError] = useState('')
  const [warning, setWarning] = useState('')

  const handleJsonInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value)
  }

  const handleLoadJson = () => {
    try {
      const jsonData = JSON.parse(jsonInput)
      const int32Array = new Int32Array(Object.values(jsonData))
      setInput(int32Array)
      console.log('Int32Array created from input:', int32Array)
    } catch (err) {
      console.error('Failed to parse JSON input: ', err)
      setError('Failed to parse JSON input. Please ensure you have entered valid JSON data.')
    }
  }

  const handleParse = () => {
    try {
      setError('')
      setWarning('')
      setParsedData([])

      if (!input) {
        throw new Error('No input data available')
      }

      console.log('Parsing input:', input)
      console.log('First 16 elements:', Array.from(input.slice(0, 16)))

      // Convert Int32Array to DICOM tag format
      const dicomData = new Uint8Array(input.length * 4)
      input.forEach((value, index) => {
        const bytes = new Uint8Array(new Int32Array([value]).buffer)
        dicomData.set(bytes, index * 4)
      })

      let dataSet
      try {
        dataSet = dicomParser.parseDicom(dicomData)
      } catch (e) {
        console.error('DICOM parsing error:', e)
        if (e instanceof Error) {
          throw new Error(`Failed to parse DICOM data: ${e.message}`)
        } else {
          throw new Error('Failed to parse DICOM data: Unknown error')
        }
      }

      if (!dataSet) {
        throw new Error('DICOM parser returned undefined dataset')
      }

      if (!dataSet.elements || Object.keys(dataSet.elements).length === 0) {
        setWarning('The DICOM data contains only header information. No DICOM tags are available.')
        return
      }

      const parsedTags = []
      for (let tag in dataSet.elements) {
        const element = dataSet.elements[tag]
        if (element) {
          const formattedTag = tag.slice(1).toUpperCase() // Remove leading 'x' and convert to uppercase
          console.log('Formatted tag:', formattedTag) // Log the formatted tag
          let value
          if (element.vr === 'SQ') {
            value = 'Sequence'
          } else {
            try {
              value = dataSet.string(tag) || 'N/A'
            } catch (e) {
              value = 'Unable to read value'
            }
          }
          parsedTags.push({
            tag: formattedTag,
            name: simplifiedDictionary[formattedTag]?.name || 'Unknown',
            value: value
          })
        }
      }

      console.log('Parsed tags:', parsedTags) // Log all parsed tags

      if (parsedTags.length === 0) {
        setWarning('No recognizable DICOM tags were found in the parsed data.')
      } else {
        setParsedData(parsedTags)
      }
    } catch (err) {
      console.error(err)
      setError(`Error parsing DICOM data: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>DICOM Int32Array Parser</CardTitle>
          <CardDescription>
            Paste the JSON representation of the Int32Array into the textarea below, then click "Load JSON" to prepare the data. After loading, click "Parse DICOM" to view the parsed data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your JSON data here..."
            value={jsonInput}
            onChange={handleJsonInputChange}
            className="min-h-[200px] mb-4"
          />
          <div className="flex space-x-4">
            <Button onClick={handleLoadJson}>Load JSON</Button>
            <Button onClick={handleParse} disabled={!input}>Parse DICOM</Button>
          </div>
          {input && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Data loaded</AlertTitle>
              <AlertDescription>
                Int32Array of {input.length} elements has been loaded. Click "Parse DICOM" to process the data.
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {warning && (
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {parsedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Parsed DICOM Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tag</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.tag}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>About DICOM Parsing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This application allows you to parse DICOM (Digital Imaging and Communications in Medicine) data from an Int32Array. DICOM is the international standard for medical images and related information, defining formats for exchanging medical image data.
          </p>
          <p className="mb-4">
            To use this parser:
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Paste the JSON representation of the Int32Array containing DICOM data into the textarea.</li>
            <li>Click the "Load JSON" button to prepare the data for parsing.</li>
            <li>Click "Parse DICOM" to process the data and view the results.</li>
          </ol>
          <p>
            The parser will attempt to extract key DICOM tags and display them in a human-readable format. This can be useful for quickly inspecting DICOM data or for educational purposes in understanding DICOM structure.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}