
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SizeGuide as SizeGuideType } from "@/types/inventory";

interface SizeGuideProps {
  guide: SizeGuideType;
}

export const SizeGuide: React.FC<SizeGuideProps> = ({ guide }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Size Guide</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Size Guide - {guide.category}</DialogTitle>
        </DialogHeader>
        
        {guide.measurementInstructions && (
          <p className="text-sm text-muted-foreground mb-4">
            {guide.measurementInstructions}
          </p>
        )}
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              {Object.keys(guide.measurements[0].dimensions).map((dim) => (
                <TableHead key={dim}>{dim}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {guide.measurements.map((measurement, idx) => (
              <TableRow key={idx}>
                <TableCell>{measurement.size}</TableCell>
                {Object.entries(measurement.dimensions).map(([key, value]) => (
                  <TableCell key={key}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};
