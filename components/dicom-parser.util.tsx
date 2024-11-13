// Simplified DICOM dictionary based on dicom.ts structure
const simplifiedDictionary: { [key: string]: { name: string; vr: string } } = {
  "00080005": { name: "Specific Character Set", vr: "CS" },
  "00080016": { name: "SOP Class UID", vr: "UI" },
  "00080018": { name: "SOP Instance UID", vr: "UI" },
  "00080020": { name: "Study Date", vr: "DA" },
  "00080030": { name: "Study Time", vr: "TM" },
  "00080050": { name: "Accession Number", vr: "SH" },
  "00080060": { name: "Modality", vr: "CS" },
  "00080070": { name: "Manufacturer", vr: "LO" },
  "00080090": { name: "Referring Physician's Name", vr: "PN" },
  "0008103E": { name: "Series Description", vr: "LO" },
  "00100010": { name: "Patient's Name", vr: "PN" },
  "00100020": { name: "Patient ID", vr: "LO" },
  "00100030": { name: "Patient's Birth Date", vr: "DA" },
  "00100040": { name: "Patient's Sex", vr: "CS" },
  "0020000D": { name: "Study Instance UID", vr: "UI" },
  "0020000E": { name: "Series Instance UID", vr: "UI" },
  "00200010": { name: "Study ID", vr: "SH" },
  "00200011": { name: "Series Number", vr: "IS" },
  "00200013": { name: "Instance Number", vr: "IS" },
  "00280010": { name: "Rows", vr: "US" },
  "00280011": { name: "Columns", vr: "US" },
  "00280100": { name: "Bits Allocated", vr: "US" },
  "00280101": { name: "Bits Stored", vr: "US" },
  "00280102": { name: "High Bit", vr: "US" },
  "00280103": { name: "Pixel Representation", vr: "US" },
  "7FE00010": { name: "Pixel Data", vr: "OW" },
  "00283110": { name: "Softcopy VOI LUT Sequence", vr: "unknown" },
  "0040A043": { name: "Concept Name Code Sequence", vr: "unknown" },
  "0040A050": { name: "Continuity Of Content", vr: "unknown" },
  "0040A372": { name: "Performed Procedure Code Sequence", vr: "unknown" },
  "0040A375": {
    name: "Current Requested Procedure Evidence Sequence",
    vr: "unknown",
  },
  "0040A491": { name: "Completion Flag", vr: "unknown" },
  "0040A493": { name: "Verification Flag", vr: "unknown" },
  "0040A504": { name: "Content Template Sequence", vr: "unknown" },
  "0040A730": { name: "Content Sequence", vr: "unknown" },
  "00700041": { name: "unknown", vr: "unknown" },
  "00700042": { name: "Image Horizontal Flip", vr: "unknown" },
  "0070005A": { name: "Image Rotation", vr: "unknown" },
  "00020000": { name: "File Meta Information Group Length", vr: "unknown" },
  "00020001": { name: "File Meta Information Version", vr: "unknown" },
  "00020002": { name: "Media Storage SOP Class UID", vr: "unknown" },
  "00020003": { name: "	Media Storage SOP Instance UID", vr: "unknown" },
  "00020010": { name: "Transfer Syntax UID", vr: "unknown" },
  "00020012": { name: "Implementation Class UID", vr: "unknown" },
  "00020013": { name: "Implementation Version Name", vr: "unknown" },
};

export const dicomDictionary: { [key: string]: string } = {
  "00080008": "Image Type",
  "00080020": "Study Date",
  "00080030": "Study Time",
  "00080050": "Accession Number",
  "00080052": "Query/Retrieve Level",
  "00080061": "Modalities in Study",
  "00080070": "Manufacturer",
  "00081010": "Station Name",
  "00081030": "Study Description",
  "00081070": "Operators' Name",
  "00081090": "Manufacturer's Model Name",
  "00100010": "Patient's Name",
  "00100020": "Patient ID",
  "00100040": "Patient's Sex",
  "00180020": "Scanning Sequence",
  "00180021": "Sequence Variant",
  "00180022": "Scan Options",
  "00180023": "MR Acquisition Type",
  "00180050": "Slice Thickness",
  "00180080": "Repetition Time",
  "00180081": "Echo Time",
  "00180082": "Inversion Time",
  "00180083": "Number of Averages",
  "00180084": "Imaging Frequency",
  "00180085": "Imaged Nucleus",
  "00180086": "Echo Number(s)",
  "00180087": "Magnetic Field Strength",
  "00180088": "Spacing Between Slices",
  "00180089": "Number of Phase Encoding Steps",
  "00180091": "Echo Train Length",
  "00180093": "Percent Sampling",
  "00180094": "Percent Phase Field of View",
  "00180095": "Pixel Bandwidth",
  "00181000": "Device Serial Number",
  "00181020": "Software Versions",
  "00181314": "Flip Angle",
  "00181315": "Variable Flip Angle Flag",
  "00181316": "SAR",
  "0020000D": "Study Instance UID",
  "00201208": "Number of Study Related Instances",
  "00250010": "Prenuvo General Data",
  "0025100B": "Prenuvo Viewer Version",
  "00251011": "Prenuvo Clinic Name",
  "0025102F": "Prenuvo Clinic Location",
  "0051100A": "Acquisition Time",
  "0051100B": "Image Matrix",
  "0051100C": "Field of View",
  "0051100D": "Slice Position",
  "0051100F": "Sequence Type",
  "00511011": "Sequence Variant",
  "00511016": "Sequence Name",
  "00511017": "Slice Thickness",
};

export const parse = (
  input: Int32Array | null,
  dicomParser: typeof import("dicom-parser"),
  setWarning: (warning: string) => void,
  setParsedData: (
    parsedData: { tag: string; name: string; value: string }[]
  ) => void,
  setError: (error: string) => void
) => {
  try {
    setError("");
    setWarning("");
    setParsedData([]);

    if (!input) {
      throw new Error("No input data available");
    }

    console.log("Parsing input:", input);
    console.log("First 16 elements:", Array.from(input.slice(0, 16)));

    // Convert Int32Array to DICOM tag format
    const dicomData = new Uint8Array(input.length * 4);
    input.forEach((value, index) => {
      const bytes = new Uint8Array(new Int32Array([value]).buffer);
      dicomData.set(bytes, index * 4);
    });

    let dataSet;
    try {
      dataSet = dicomParser.parseDicom(dicomData);
    } catch (e) {
      console.error("DICOM parsing error:", e);
      if (e instanceof Error) {
        throw new Error(`Failed to parse DICOM data: ${e.message}`);
      } else {
        throw new Error("Failed to parse DICOM data: Unknown error");
      }
    }

    if (!dataSet) {
      throw new Error("DICOM parser returned undefined dataset");
    }

    if (!dataSet.elements || Object.keys(dataSet.elements).length === 0) {
      setWarning(
        "The DICOM data contains only header information. No DICOM tags are available."
      );
      return;
    }

    const parsedTags: { tag: string; name: string; value: string }[] = [];
    for (const tag in dataSet.elements) {
      const element = dataSet.elements[tag];
      if (element) {
        const formattedTag = tag.slice(1).toUpperCase(); // Remove leading 'x' and convert to uppercase
        console.log("Formatted tag:", formattedTag); // Log the formatted tag
        let value;
        if (element.vr === "SQ") {
          value = "Sequence";
        } else {
          try {
            value = dataSet.string(tag) || "N/A";
          } catch (e) {
            value = "Unable to read value";
            console.log("Error reading value for tag", tag, e);
          }
        }
        parsedTags.push({
          tag: formattedTag,
          name: simplifiedDictionary[formattedTag]?.name || "Unknown",
          value: value,
        });
      }
    }

    console.log("Parsed tags:", parsedTags); // Log all parsed tags

    if (parsedTags.length === 0) {
      setWarning("No recognizable DICOM tags were found in the parsed data.");
    } else {
      setParsedData(parsedTags);
    }
  } catch (err) {
    console.error(err);
    setError(
      `Error parsing DICOM data: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};
