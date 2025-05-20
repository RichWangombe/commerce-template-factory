
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Ruler, HelpCircle, Printer } from "lucide-react";

export interface SizeGuideProps {
  category: string;
}

export const SizeGuide: React.FC<SizeGuideProps> = ({ category }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const getCategorySizes = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'clothing':
      case 'apparel':
        return {
          title: 'Clothing Size Guide',
          headers: ['Size', 'Chest (in)', 'Waist (in)', 'Hips (in)'],
          rows: [
            ['S', '36-38', '30-32', '36-38'],
            ['M', '39-41', '33-34', '39-41'],
            ['L', '42-44', '35-37', '42-44'],
            ['XL', '45-47', '38-40', '45-47'],
            ['XXL', '48-50', '41-43', '48-50'],
          ]
        };
      case 'shoes':
      case 'footwear':
        return {
          title: 'Footwear Size Guide',
          headers: ['US', 'EU', 'UK', 'Foot Length (in)'],
          rows: [
            ['7', '40', '6', '9.6'],
            ['8', '41', '7', '9.9'],
            ['9', '42', '8', '10.2'],
            ['10', '43', '9', '10.5'],
            ['11', '44', '10', '10.8'],
            ['12', '45', '11', '11.1'],
          ]
        };
      case 'electronics':
      case 'accessories':
      default:
        return null;
    }
  };
  
  const sizeData = getCategorySizes(category);
  
  if (!sizeData) return null;
  
  return (
    <div className="mt-8">
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Ruler className="h-4 w-4" />
        <span>Size Guide</span>
      </Button>
      
      {isOpen && (
        <Card className="mt-4 animate-in fade-in-50 duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{sizeData.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4 mr-1" />
                Help
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {sizeData.headers.map((header, index) => (
                      <TableHead key={index}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sizeData.rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Measuring Tips:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>For best results, have someone else take your measurements.</li>
                <li>Measure over undergarments or lightweight clothing.</li>
                <li>Keep the measuring tape snug but not tight.</li>
                <li>When in doubt, size up for a more comfortable fit.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SizeGuide;
