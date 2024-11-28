import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
function TableContent() {
  return (
    <div>
      <Table className="border-collapse">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Urgency</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Recieve Date</TableHead>
            <TableHead>Reciever</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium fixed">Farman</TableCell>
            <TableCell>Normal</TableCell>
            <TableCell>2333</TableCell>
            <TableCell>2024/22/22</TableCell>
            <TableCell>2024/22/33</TableCell>
            <TableCell>Hameed</TableCell>
            <TableCell>Complete</TableCell>
            <TableCell>2days</TableCell>
          </TableRow>
          <TableRow className=" !border-0 ">
            <TableCell className="font-bold !border-0">Refered</TableCell>
            <TableCell colSpan={8} className="!border-0">
              1. Muqam, 2. HR
            </TableCell>
          </TableRow>

          <TableRow className="w-full border-t border-gray-400 ">
            <TableCell className="font-bold border-t  border-gray-400">
              Total
            </TableCell>
            <TableCell className="w-full border-t border-gray-400 " colSpan={8}>
              30 Maktubs, 43 Istalaams, 24 orders
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default TableContent;
