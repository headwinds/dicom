"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, AlertTriangle } from "lucide-react";
import React from "react";

interface AboutProps {
  jsonInput: string;
  handleJsonInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleLoadJson: () => void;
  handleSampleJson: () => void;
  handleParse: () => void;
  handleClear: () => void;
  input: string;
  error: string;
  warning: string;
}

const About: React.FC = ({
  jsonInput,
  handleJsonInputChange,
  handleLoadJson,
  handleSampleJson,
  handleParse,
  handleClear,
  input,
  error,
  warning,
  isSample,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DICOM Int32Array Parser</CardTitle>
        <CardDescription>
          Paste the JSON representation of the Int32Array into the textarea
          below, then click "Load JSON" to prepare the data. After loading,
          click "Parse DICOM" to view the parsed data.
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
          {/*<Button onClick={handleLoadJson}>Load JSON</Button>*/}
          <Button
            onClick={handleSampleJson}
            className="bg-teal-800"
            disabled={isSample}
          >
            Use Sample JSON
          </Button>
          {/*<Button onClick={handleParse} disabled={!input}>
            Parse DICOM
          </Button>*/}
          <Button onClick={handleClear} disabled={!input}>
            Clear
          </Button>
        </div>
        {input && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Data loaded</AlertTitle>
            <AlertDescription>
              Int32Array of {input.length} elements has been loaded. Click
              "Parse DICOM" to process the data.
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
  );
};

export default About;
