# Parse a DICOM Buffered Array

An experiment to parse [DICOM](https://www.dicomstandard.org/about) and learn more about it's [Multipart](https://dicom.nema.org/medical/dicom/current/output/chtml/part18/sect_8.7.html) content type and how [dcmjs](https://github.com/dcmjs-org/dcmjs) uses an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) to make DICOM post requests.

You can copy and paste Int32 array from your clipboard into the input. See the included sample.json for an example.

### Demo & Prototype

- [dicom-standard.vercel.app](https://dicom-standard.vercel.app/)
- [dicom-buffer.verce.app](https://dicom-buffer.vercel.app/)
- [v0 convo](https://v0.dev/chat/XB512mtnRje?b=b_qDriYBBHbbZ)

### More About DICOM

DICOM is a [standard](https://www.dicomstandard.org/current) for files (.dcm) contain both metadata (tags) and pixel data.

The data is organized into a series of data elements with specific Value Representations (VR) that define their data types.

### Why Multipart content type instead of JSON?

DICOM uses Multipart content type to encapsulate multiple data elements in a single message. This is because DICOM is designed to handle large medical images and other data types that are not easily represented in JSON format. Multipart content type allows DICOM to efficiently transmit and store complex data structures without the need for additional encoding or compression.

Multipart messages allow combining multiple parts of data that are merged after request completion.

Parts are separated by boundaries specified in the Content-Type header.

[OHIF](https://ohif.org/) relies on cornerstonejs and the dcmjs library to parse DICOM files and make http requests to the DICOM server.

The [Cornerstone dicomParser](https://github.com/cornerstonejs/dicomParser) library actually doesn't include a built-in data dictionary by design1. This is an intentional choice as the library focuses on lightweight parsing without requiring a data dictionary.

## Why tags and not English?

DICOM uses tags to identify data elements. Tags are 32-bit numbers that are divided into two parts: a group number and an element number. The group number identifies the type of data element, while the element number identifies the specific data element within that group.

By using tags instead of English names, DICOM ensures that data elements are uniquely identified and can be easily referenced by software applications. This allows DICOM files to be easily parsed and processed by different systems without the need for translation or conversion. Thus, Radiologists in Russia or China can easily read the DICOM files without the need for translation.

Since there are an overwhelming number of tags, it is recommended for each company to create their own dictionary for the tags they require. To get started, companies can use a data dictionary to map tags to human-readable names.

## Tag System

The [DICOM standard](https://en.wikipedia.org/wiki/DICOM) uses a comprehensive system where:

- Tags are organized in groups and elements (XXXX,XXXX format)
- Public data elements have even group numbers (defined in the DICOM data dictionary)
- Private data elements have odd group numbers (manufacturer-specific)

Example: (0008,0020) is the Study Date tag

Each DICOM tag consists of:

- A unique identifier in (group,element) format
- One of 27 explicit Value Representations (VRs)
- A value length
- The actual value data

There is an extensive list of tags that can be found in the [DICOM data dictionary](https://www.dicomlibrary.com/dicom/dicom-tags/).

## Javascript

- [dcmjs](https://github.com/dcmjs-org/dcmjs)
- [dcmjs dictionary](https://github.com/dcmjs-org/dcmjs/blob/6840af9d20333144675227b7006772a3a1b84e46/src/dictionary.js)

## Typescript

- [dicom.ts](https://github.com/wearemothership/dicom.ts) by [wearemothership](https://wearemothership.com/)

## Console Logging ArrayBuffer

```
ArrayBuffer(2908)
    byteLength: 2908
    detached: false
    maxByteLength: 2908
    resizable: false
    [[Prototype]]: ArrayBuffer
    [[Int8Array]]: Int8Array(2908)
    [[Uint8Array]]: Uint8Array(2908)
    [[Int16Array]]: Int16Array(1454)
    [[Int32Array]]: Int32Array(727)
    [[ArrayBufferByteLength]]: 2908
    [[ArrayBufferData]]: 92529
```

The ArrayBuffer holds 2908 bytes of raw binary data.

Each array type provides a different way to read/interpret those same bytes.

each array type is viewing the exact same bytes, just grouping them differently by size and interpreting their values according to their type (signed vs unsigned).

```
// Same 4 bytes could be read as:
Int8Array:   [1, 2, 3, 4]         // Four 8-bit numbers
Int16Array:  [513, 1027]          // Two 16-bit numbers
Int32Array:  [67305985]           // One 32-bit number
```

DICOM files the Int32Array data is typically organized into distinct sections. Here's the standard structure:

## DICOM Data Organization

#### Preamble & Prefix (128 + 4 bytes)

```
// First 132 bytes
const preamble = new Uint8Array(arrayBuffer, 0, 128);
const pre
```

#### Meta Information Header

- Usually follows prefix
- Contains file metadata (Transfer Syntax, - Implementation details)
- Group number (0002,xxxx)

#### Data Elements

Organized as sequences of:

```
Tag (4 bytes) - Group,Element numbers
VR (2 bytes) - Value Representation
Length (2 or 4 bytes)
Value (variable length)

```

#### Pixel Data

- Usually at the end
- Tag (7FE0,0010)
- Contains actual image data

```
const dicomData = new Int32Array(arrayBuffer);

// Accessing sections
const metaHeaderStart = 132 / 4; // Convert bytes to 32-bit integers
const elementStart = metaHeaderStart + (metaHeaderLength / 4);
const pixelDataStart = (pixelDataOffset / 4);
```

Note: Exact offsets depend on transfer syntax and encoding used in the file.

## Python

- [pydicom](https://github.com/pydicom/pydicom)
