'use client'

import { useState } from 'react'
import * as dicomParser from 'dicom-parser'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Simple DICOM dictionary (expanded for demonstration)
const dicomDictionary = {
  '00100010': 'Patient\'s Name',
  '00100020': 'Patient ID',
  '00100030': 'Patient\'s Birth Date',
  '00100040': 'Patient\'s Sex',
  '00080060': 'Modality',
  '00080070': 'Manufacturer',
  '00080090': 'Referring Physician\'s Name',
  '00181000': 'Device Serial Number',
  '00181020': 'Software Versions',
  '0020000D': 'Study Instance UID',
  '0020000E': 'Series Instance UID',
  '00080018': 'SOP Instance UID',
  // Add more DICOM tags as needed
}

export default function Component() {
  const [input, setInput] = useState('')
  const [parsedData, setParsedData] = useState<{ tag: string; name: string; value: string }[]>([])
  const [error, setError] = useState('')

  const parseMultipartData = (data: string) => {
    const boundary = data.split('\n')[0].trim()
    const parts = data.split(boundary).slice(1, -1)
    return parts.map(part => {
      const [headers, content] = part.split('\r\n\r\n')
      const contentType = headers.match(/Content-Type: (.+)/)?.[1]
      return { contentType, content: content.trim() }
    })
  }

  const handleParse = () => {
    try {
      setError('')
      const parts = parseMultipartData(input)
      const dicomPart = parts.find(part => part.contentType === 'application/dicom')
      
      if (!dicomPart) {
        throw new Error('No DICOM data found in the multipart request')
      }

      const byteArray = new Uint8Array(Buffer.from(dicomPart.content, 'base64'))
      const dataSet = dicomParser.parseDicom(byteArray)

      const parsedTags = []
      for (let tag in dicomDictionary) {
        const element = dataSet.elements[tag]
        if (element) {
          const value = dataSet.string(tag)
          parsedTags.push({
            tag,
            name: dicomDictionary[tag as keyof typeof dicomDictionary],
            value: value || 'N/A'
          })
        }
      }

      setParsedData(parsedTags)
    } catch (err) {
      console.error(err)
      setError('Error parsing DICOM data. Please check your input and try again.')
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>DICOM Multipart Data Parser</CardTitle>
          <CardDescription>
            Paste your DICOM multipart network request below and click "Parse DICOM" to view the parsed data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste your DICOM multipart data here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] mb-4"
          />
          <Button onClick={handleParse}>Parse DICOM</Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
      </Card>

      {parsedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Parsed DICOM Tags</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>About DICOM and Multipart Data</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">What is DICOM?</h3>
          <p className="mb-4">
            DICOM (Digital Imaging and Communications in Medicine) is the international standard for medical images and related information. It defines the formats for medical images that can be exchanged with the data and quality necessary for clinical use.
          </p>
          <h3 className="text-lg font-semibold mb-2">Multipart Data in DICOM</h3>
          <p className="mb-4">
            Multipart data in DICOM allows for the transmission of multiple related pieces of information in a single message. This can include the DICOM file itself, along with metadata, reports, or other associated data. Each part is separated by a boundary and has its own content type.
          </p>
          <h3 className="text-lg font-semibold mb-2">Parsing Multipart DICOM Data</h3>
          <p>
            Parsing multipart DICOM data involves separating the different parts of the message, identifying the DICOM content, and then using a DICOM parser to extract the information from the DICOM part. This app demonstrates a simple way to do this, allowing developers to better understand the structure of DICOM data and how to work with it programmatically.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}