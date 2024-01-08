import { CheckoutLayout } from '@/src/layouts';
import { makeServerSideProps, prepareSSRRedirect } from '@/src/lib/getStatic';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import React from 'react';
import { OrderSummary } from './components/OrderSummary';
import { OrderForm } from './components/OrderForm';
import { getYMALProducts } from '@/src/graphql/sharedQueries';
import { Content, Main } from './components/ui/Shared';
import { SSRQuery } from '@/src/graphql/client';
import { ActiveOrderSelector, AvailableCountriesSelector } from '@/src/graphql/selectors';
import { useTranslation } from 'next-i18next';

const CheckoutPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = props => {
    const { t } = useTranslation('checkout');
    const { availableCountries, YMALProducts } = props;

    return (
        <CheckoutLayout pageTitle={`${t('seoTitles.checkout')}`}>
            <Content>
                <Main w100 justifyBetween>
                    <OrderForm availableCountries={availableCountries} language={props.language ?? 'en'} />
                    <OrderSummary isForm YMALProducts={YMALProducts} />
                </Main>
            </Content>
        </CheckoutLayout>
    );
};

const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const r = await makeServerSideProps(['common', 'checkout'])(context);
    const language = r.props._nextI18Next?.initialLocale ?? 'en';
    const homePageRedirect = prepareSSRRedirect('/')(context);
    const paymentRedirect = prepareSSRRedirect('/checkout/payment')(context);

    try {
        const [{ activeOrder }, { availableCountries }] = await Promise.all([
            SSRQuery(context)({ activeOrder: ActiveOrderSelector }),
            SSRQuery(context)({ availableCountries: AvailableCountriesSelector }),
        ]);
        const YMALProducts = await getYMALProducts(language);

        if (activeOrder?.state === 'ArrangingPayment') {
            return paymentRedirect;
        }

        if (!activeOrder || activeOrder.lines.length === 0) {
            return homePageRedirect;
        }
        //MOST IMPORTANT PART WE HAVE TO RETURN `checkout` BECAUSE WE LOOK FOR IT IN _app.tsx
        const returnedStuff = {
            ...r.props,
            availableCountries,
            checkout: activeOrder,
            YMALProducts,
            language,
        };

        return { props: returnedStuff };
    } catch (e) {
        return homePageRedirect;
    }
};

export { getServerSideProps };
export default CheckoutPage;
