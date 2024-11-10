"use client";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";
import { AlertCircle, AlertTriangle } from "lucide-react";
import React from "react";

interface ParserProps {
  jsonInput: string;
  handleJsonInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSampleJson: () => void;
  handleClear: () => void;
  input: string;
  error: string;
  warning: string;
  isSample: boolean;
}

const Parser = ({
  jsonInput,
  handleJsonInputChange,
  handleSampleJson,
  handleClear,
  input,
  error,
  warning,
  isSample,
}: ParserProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DICOM Int32Array Parser</CardTitle>
        <CardDescription>
          Paste the JSON representation of the Int32Array into the textarea
          below, then click &quot;Load JSON&quot; to prepare the data. After
          loading, click &quot;Parse DICOM&quot; to view the parsed data.
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
          <Button
            onClick={handleSampleJson}
            className="bg-teal-800"
            disabled={isSample}
          >
            Use Sample JSON
          </Button>

          <Button onClick={handleClear} disabled={!input}>
            Clear
          </Button>
        </div>
        {input && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Data loaded</AlertTitle>
            <AlertDescription>
              Int32Array of {input.length} elements has been loaded. Click Parse
              DICOM to process the data.
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
          <Alert variant="default">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>{warning}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default Parser;
