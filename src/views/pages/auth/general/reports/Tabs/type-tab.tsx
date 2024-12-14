import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Card from "@/components/custom-ui/card/Card";

function TypeTab() {
  return (
    <div className="flex flex-col gap-y-12">
      <Card className="p-0">
        <Table className="min-w-full bg-white border rounded-lg shadow-xl">
          <TableHeader>
            <TableRow className="text-left text-gray-600">
              <TableHead className="p-3 border-b">No</TableHead>
              <TableHead className="p-3 border-b">Type</TableHead>
              <TableHead className="p-3 border-b">Status</TableHead>
              <TableHead className="p-3 border-b">Urgency</TableHead>
              <TableHead className="p-3 border-b">Source</TableHead>
              <TableHead className="p-3 border-b"> Date</TableHead>
              <TableHead className="p-3 border-b">Recieve Date</TableHead>
              <TableHead className="p-3 border-b">User</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <>
              <TableRow>
                <TableCell className="p-3 border-b">1</TableCell>
                <TableCell className="p-3 border-b">Maktube</TableCell>
                <TableCell className="p-3 border-b">In progres</TableCell>
                <TableCell className="p-3 border-b">Urgent</TableCell>
                <TableCell className="p-3 border-b">Urgent</TableCell>
                <TableCell className="p-3 border-b">2024/22/33</TableCell>
                <TableCell className="p-3 border-b">2024/5/9</TableCell>
                <TableCell className="p-3 border-b">Reyasat Defter</TableCell>
              </TableRow>
            </>

            <TableRow className="p-3 border-b">
              <TableCell colSpan={2} className="p-3 border-bt">
                Total
              </TableCell>
              <TableCell colSpan={8} className="p-3 border-b">
                30 Maktubs, 43 Istalaams, 24 orders
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
export default TypeTab;
