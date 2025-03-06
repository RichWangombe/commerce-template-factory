
import { ColumnDef } from "@tanstack/react-table"
import { RecommendationClickEvent } from "@/types/recommendation"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export const recommendationColumns: ColumnDef<RecommendationClickEvent>[] = [
  {
    accessorKey: "productId",
    header: "Product ID",
    cell: ({ row }) => <div>{row.getValue("productId")}</div>,
  },
  {
    accessorKey: "recommendationType",
    header: "Recommendation Type",
    cell: ({ row }) => {
      const type = row.getValue("recommendationType") as string;
      let color = "bg-gray-100 text-gray-800";
      
      switch (type) {
        case "viewed":
          color = "bg-blue-100 text-blue-800";
          break;
        case "purchased":
          color = "bg-green-100 text-green-800";
          break;
        case "similar":
          color = "bg-purple-100 text-purple-800";
          break;
        case "trending":
          color = "bg-amber-100 text-amber-800";
          break;
        case "collaborative":
          color = "bg-indigo-100 text-indigo-800";
          break;
        case "seasonal":
          color = "bg-red-100 text-red-800";
          break;
      }
      
      return (
        <Badge variant="outline" className={color}>
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const timestamp = row.getValue("timestamp") as string;
      const date = new Date(timestamp);
      return <div>{format(date, "PPP p")}</div>;
    },
  },
]
