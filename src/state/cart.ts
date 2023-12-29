import { storefrontApiMutation, storefrontApiQuery } from '@/src/graphql/client';
import { ActiveOrderSelector, ActiveOrderType } from '@/src/graphql/selectors';
import { useState } from 'react';
import { createContainer } from 'unstated-next';

const TEMP_CUSTOMER = 'vendure-customer';

const useCartContainer = createContainer(() => {
    const [activeOrder, setActiveOrder] = useState<ActiveOrderType>();
    const [isLogged, setIsLogged] = useState(false);

    const fetchActiveOrder = async () => {
        const response = await storefrontApiQuery({
            activeOrder: ActiveOrderSelector,
        });
        setActiveOrder(response.activeOrder);

        const { activeCustomer } = await storefrontApiQuery({
            activeCustomer: {
                id: true,
            },
        });
        setIsLogged(!!activeCustomer?.id);

        return response.activeOrder;
    };

    const setTemporaryCustomerForOrder = async () => {
        const tempCustomerId = window.localStorage.getItem(TEMP_CUSTOMER) || Math.random().toFixed(8);
        window.localStorage.setItem(TEMP_CUSTOMER, tempCustomerId);
        storefrontApiMutation({
            setCustomerForOrder: [
                {
                    input: {
                        firstName: 'Artur',
                        lastName: 'Czemiel',
                        emailAddress: 'artur@aexol.com',
                    },
                },
                {
                    __typename: true,
                    '...on Order': ActiveOrderSelector,
                    '...on AlreadyLoggedInError': {
                        errorCode: true,
                        message: true,
                    },
                    '...on EmailAddressConflictError': {
                        errorCode: true,
                        message: true,
                    },
                    '...on GuestCheckoutError': {
                        errorCode: true,
                        message: true,
                    },
                    '...on NoActiveOrderError': {
                        errorCode: true,
                        message: true,
                    },
                },
            ],
        }).then(r => {
            if (r.setCustomerForOrder.__typename === 'Order') {
                setActiveOrder(r.setCustomerForOrder);
            }
        });
    };

    const addToCart = async (id: string, q: number, o?: boolean) => {
        //TODO: work here
        // const founded = activeOrder?.lines.find(l => l.productVariant.id === id);
        setActiveOrder(c => {
            return c && { ...c, totalQuantity: c.totalQuantity + 1 };
        });
        try {
            const { addItemToOrder } = await storefrontApiMutation({
                addItemToOrder: [
                    { productVariantId: id, quantity: q },
                    {
                        __typename: true,
                        '...on Order': ActiveOrderSelector,
                        '...on OrderLimitError': {
                            errorCode: true,
                            message: true,
                        },
                        '...on InsufficientStockError': {
                            errorCode: true,
                            message: true,
                        },
                        '...on NegativeQuantityError': {
                            errorCode: true,
                            message: true,
                        },
                        '...on OrderModificationError': {
                            errorCode: true,
                            message: true,
                        },
                    },
                ],
            });
            if (addItemToOrder.__typename === 'Order') {
                setActiveOrder(addItemToOrder);
                if (o) open();
                return true;
            }
        } catch (e) {
            return false;
        }
    };
    const removeFromCart = (id: string) => {
        setActiveOrder(c => {
            return c && { ...c, lines: c.lines.filter(l => l.id !== id) };
        });
        storefrontApiMutation({
            removeOrderLine: [
                { orderLineId: id },
                {
                    '...on Order': ActiveOrderSelector,
                    '...on OrderModificationError': {
                        errorCode: true,
                        message: true,
                    },
                    __typename: true,
                },
            ],
        }).then(r => {
            if (r.removeOrderLine.__typename === 'Order') {
                setActiveOrder(r.removeOrderLine);
                return;
            }
            return r.removeOrderLine;
        });
    };
    const setItemQuantityInCart = (id: string, q: number) => {
        setActiveOrder(c => {
            if (c?.lines.find(l => l.id === id)) {
                return { ...c, lines: c.lines.map(l => (l.id === id ? { ...l, q } : l)) };
            }
            return c;
        });
        return storefrontApiMutation({
            adjustOrderLine: [
                { orderLineId: id, quantity: q },
                {
                    '...on Order': ActiveOrderSelector,
                    '...on OrderLimitError': {
                        errorCode: true,
                        message: true,
                    },
                    '...on InsufficientStockError': {
                        errorCode: true,
                        message: true,
                    },
                    '...on NegativeQuantityError': {
                        errorCode: true,
                        message: true,
                    },
                    '...on OrderModificationError': {
                        errorCode: true,
                        message: true,
                    },
                    __typename: true,
                },
            ],
        })
            .then(r => {
                if (r.adjustOrderLine.__typename === 'Order') {
                    setActiveOrder(r.adjustOrderLine);
                    return;
                }
                return r.adjustOrderLine;
            })
            .catch(e => {
                console.log(e);
            });
    };

    const applyCouponCode = async (code: string) => {
        const { applyCouponCode } = await storefrontApiMutation({
            applyCouponCode: [
                { couponCode: code },
                {
                    __typename: true,
                    '...on Order': ActiveOrderSelector,
                    '...on CouponCodeExpiredError': { errorCode: true, message: true },
                    '...on CouponCodeInvalidError': { errorCode: true, message: true },
                    '...on CouponCodeLimitError': { errorCode: true, message: true },
                },
            ],
        });
        if (applyCouponCode.__typename === 'Order') {
            setActiveOrder(applyCouponCode);
            return true;
        }
        return false;
    };

    const removeCouponCode = async (code: string) => {
        const { removeCouponCode } = await storefrontApiMutation({
            removeCouponCode: [{ couponCode: code }, ActiveOrderSelector],
        });
        if (removeCouponCode?.id) {
            setActiveOrder(removeCouponCode);
            return;
        }
    };
    const [isOpen, setOpen] = useState(false);
    const open = () => setOpen(true);
    const close = () => setOpen(false);

    return {
        isLogged,
        activeOrder,
        cart: activeOrder,
        addToCart,
        setItemQuantityInCart,
        setTemporaryCustomerForOrder,
        removeFromCart,
        fetchActiveOrder,

        applyCouponCode,
        removeCouponCode,

        isOpen,
        open,
        close,
    };
});

export const useCart = useCartContainer.useContainer;
export const CartProvider = useCartContainer.Provider;
