"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { Link } from "cross-country";
import React from "react";

const About: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About DICOM Parsing</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          This application allows you to parse DICOM (Digital Imaging and
          Communications in Medicine) data from an Int32Array. DICOM is the
          international standard for medical images and related information,
          defining formats for exchanging medical image data.
        </p>
        <p className="mb-4">To use this parser:</p>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>
            Paste the JSON representation of the Int32Array containing DICOM
            data into the textarea.
          </li>
          <li>Click the "Load JSON" button to prepare the data for parsing.</li>
          <li>Click "Parse DICOM" to process the data and view the results.</li>
        </ol>
        <p>
          The parser will attempt to extract key DICOM tags and display them in
          a human-readable format. This can be useful for quickly inspecting
          DICOM data or for educational purposes in understanding DICOM
          structure.
        </p>
      </CardContent>
      <CardContent>
        <Link url="https://www.github.com/headwinds/dicom">
          <GithubLogo size={32} color={"#000"} weight="light" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default About;
