
interface ProductSpecificationsProps {
  product: {
    brand: string;
    sku: string;
    colors: string[];
  };
}

export const ProductSpecifications = ({ product }: ProductSpecificationsProps) => {
  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold mb-4">Technical Specifications</h2>
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b">
              <td className="py-3 px-4 font-medium bg-neutral-50">Brand</td>
              <td className="py-3 px-4">{product.brand}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-medium bg-neutral-50">Model</td>
              <td className="py-3 px-4">{product.sku}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-medium bg-neutral-50">Color Options</td>
              <td className="py-3 px-4">{product.colors.join(", ")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-medium bg-neutral-50">Weight</td>
              <td className="py-3 px-4">Approx. 300g</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-medium bg-neutral-50">Warranty</td>
              <td className="py-3 px-4">1 Year Manufacturer Warranty</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium bg-neutral-50">Package Contents</td>
              <td className="py-3 px-4">Main Product, User Manual, Warranty Card</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
