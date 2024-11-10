"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dicomParser from "dicom-parser";
import { useEffect, useState } from "react";
import About from "./about";
import Headwinds from "./credit";
import { parse } from "./dicom-parser.util";
import Parser from "./parser";

import sampleJson from "../sample.json";

export function DicomParserSpa() {
  const [jsonInput, setJsonInput] = useState("");
  const [isSample, setIsSample] = useState(false);
  // set the input the sample json str

  const [input, setInput] = useState<Int32Array | null>(null);
  const [parsedData, setParsedData] = useState<
    { tag: string; name: string; value: string }[]
  >([]);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  const handleJsonInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  };

  const loadJson = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      const int32Array = new Int32Array(Object.values(jsonData));
      setInput(int32Array);
      console.log("Int32Array created from input:", int32Array);
    } catch (err) {
      console.error("Failed to parse JSON input: ", err);
      setError(
        "Failed to parse JSON input. Please ensure you have entered valid JSON data."
      );
    }
  };

  const handleLoadJson = () => {
    loadJson();
  };

  const handleSampleJson = () => {
    // can we pretty print the string?
    const prettyJson = JSON.stringify(sampleJson, null, 2);
    setJsonInput(prettyJson);
    setIsSample(true);
  };

  const handleClear = () => {
    setJsonInput("");
    setInput(null);
    setParsedData([]);
    setError("");
    setWarning("");
    setIsSample(false);
  };

  const handleParse = () => {
    parse(input, dicomParser, setWarning, setParsedData, setError);
  };

  useEffect(() => {
    if (jsonInput) {
      loadJson();
    }
  }, [jsonInput]);

  useEffect(() => {
    if (jsonInput) {
      parse(input, dicomParser, setWarning, setParsedData, setError);
    }
  }, [input]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <About />
      <Parser
        jsonInput={jsonInput}
        handleJsonInputChange={handleJsonInputChange}
        handleLoadJson={handleLoadJson}
        handleSampleJson={handleSampleJson}
        handleParse={handleParse}
        handleClear={handleClear}
        input={input}
        error={error}
        warning={warning}
        isSample={isSample}
      />

      {parsedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Parsed DICOM Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-[400px] border-t-2 border-b-2">
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
      <Headwinds />
    </div>
  );
}
