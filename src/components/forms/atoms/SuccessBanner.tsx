import { forwardRef } from 'react';
import { Stack } from '@/src/components/atoms/Stack';
import styled from '@emotion/styled';
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

type SuccessBannerType = HTMLMotionProps<'div'> & {
    successMessage?: string;
    hideBanner: () => void;
};

export const SuccessBanner = forwardRef((props: SuccessBannerType, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { successMessage, hideBanner, ...rest } = props;

    return (
        <BannerWrapper>
            <Position ref={ref} />
            <AnimatePresence>
                <BannerBox
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                    }}
                    {...rest}>
                    <HideBannerButton onClick={() => hideBanner()}>
                        <X size={'1.4rem'} />
                    </HideBannerButton>

                    <BannerContent column>
                        <FormError>
                            <AlertCircle size={'1.4rem'} />
                            {successMessage}
                        </FormError>
                    </BannerContent>
                </BannerBox>
            </AnimatePresence>
        </BannerWrapper>
    );
});

SuccessBanner.displayName = 'SuccessBanner';

const BannerWrapper = styled(Stack)<{ status?: 'success' | 'error' }>`
    width: 100%;
    margin-bottom: 1rem;
    position: relative;
`;

const HideBannerButton = styled.div`
    position: absolute;
    top: 0rem;
    right: 0.6rem;
    cursor: pointer;
`;

const Position = styled.span`
    position: absolute;
    top: -1.5rem;
    left: 0;
    opacity: 0;
    pointer-events: none;
`;

const BannerBox = styled(motion.div)`
    padding: 0.8rem 1.6rem;
    width: 100%;
    border: 1px solid ${p => p.theme.success};
    font-size: 1.6rem;
    box-shadow: 0 0 0.4rem 0.4rem ${({ theme }) => theme.shadow};
`;

const BannerContent = styled(Stack)``;

const FormError = styled(motion.span)`
    font-size: 1.2rem;
    font-weight: 500;
    display: flex;
    gap: 0.6rem;
    align-items: center;
`;
