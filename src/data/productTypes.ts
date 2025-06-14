export interface ProductProp {
  ID: number;
  title: string;
  slug: string;
  price: number;
  savelist: boolean;
  image: string;
  detail: string;
  coolingCondition: string;
  sizes: string[];
  cID:number;
  cName:string;
  discountStatus:number;
  oldPrice:number;
  discountPercent:number;
}