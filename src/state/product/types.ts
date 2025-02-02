import { ProductDetailType } from '@/src/graphql/selectors';

export type Variant = ProductDetailType['variants'][number];

export type ProductContainerType = {
    product?: ProductDetailType;
    variant?: Variant;
    addingError?: string;
    handleVariant: (variant?: Variant) => void;
    handleAddToCart: () => void;
    handleBuyNow: () => void;
    handleEssentialOilClick: (oils: EssentialOil[]) => void;
    handleOptionClick: (groupId: string, id: string) => void;
    productOptionsGroups: ProductOptionsGroup[];
};

export type EssentialOil = { essentialOilId: string; amount: number };

export type OptionGroup = ProductDetailType['optionGroups'][0]['options'];
export type OptionGroupWithStock = OptionGroup[number] & { stockLevel: number; isSelected: boolean };
export type ProductOptionsGroup = OptionGroup[number] & {
    options: OptionGroupWithStock[];
};
