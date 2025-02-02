import styled from '@emotion/styled';
import { TP, Stack, Price } from '@/src/components/atoms';
import { AnimatePresence, motion } from 'framer-motion';
import { CurrencyCode } from '@/src/zeus';
import { Button } from '../molecules/Button';
import { EssentialOil } from '@/src/state/product/types';

interface ProductEssentialOilsProps {
    // TODO: set price to required
    essentialOils: { id: string; name: string; price?: { price: number; currencyCode: string, channelId: string } | undefined }[];
    handleClick: (oils: EssentialOil[]) => void;
    addingError?: string;
}

export const ProductEssentialOils: React.FC<ProductEssentialOilsProps> = ({
    essentialOils,
    handleClick,
    addingError,
}) => {
    return (
        <Stack column gap="2.5rem">
            <TP capitalize>Silice</TP>
            {essentialOils?.map((eo, i) => (
                <StyledStack key={i} column gap="1.5rem">
                    <StyledStack gap="1rem">
                        <Button onClick={() => handleClick([{ essentialOilId: eo.id, amount: 100}])}>{eo.name}</Button>
                        {eo.name} - <Price price={eo.price!.price} currencyCode={eo.price!.currencyCode as CurrencyCode} />
                    </StyledStack>
                </StyledStack>
            ))}
            <AnimatePresence>
                {addingError && (
                    <NoVariantInfo
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}>
                        <Error size="1.25rem">{addingError}</Error>
                    </NoVariantInfo>
                )}
            </AnimatePresence>
        </Stack>
    );
};

const Error = styled(TP)`
    color: ${({ theme }) => theme.error};
`;

const NoVariantInfo = styled(motion.div)``;

const VariantButton = styled.button`
    width: 9.5rem;
    padding: 1.5rem 0;
    border: none;
    outline: 0;
`;

const ColorSwatch = styled(VariantButton)<{ color: string; outOfStock: boolean; selected: boolean }>`
    width: 3rem;
    background-color: ${p => p.color};
    outline: 1px solid ${p => p.theme.outline};
    height: 3rem;
    cursor: pointer;
    ${p => p.outOfStock && `opacity: 0.5;`}
    ${p => p.selected && `outline: 2px solid ${p.theme.gray(1000)};`}
`;

const SizeSelector = styled(VariantButton)<{ selected: boolean; outOfStock: boolean }>`
    background: ${p => p.theme.gray(0)};
    color: ${p => p.theme.gray(900)};
    :hover {
        background: ${p => p.theme.gray(500)};
        color: ${p => p.theme.gray(0)};
    }
    ${p =>
        p.selected ? `background: ${p.theme.button.back}; color: ${p.theme.gray(0)};` : p.outOfStock && `opacity: 0.5;`}
`;

const StyledStack = styled(Stack)`
    justify-content: center;
    align-items: center;
    @media (min-width: 1024px) {
        justify-content: flex-start;
        align-items: flex-start;
    }
`;
