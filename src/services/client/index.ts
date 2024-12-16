import { apiConsumerFactory } from "./api.factory";

export const categoryConsumer = apiConsumerFactory({
    endpoint: 'category',
    validEndpoints: ['GET']
});

export const commerceConsumer = apiConsumerFactory({
    endpoint: 'commerce',
    validEndpoints: ['GET', 'POST']
});

export const orderConsumer = apiConsumerFactory({
    endpoint: 'order',
    validEndpoints: ['GET','POST']
});

export const productConsumer = apiConsumerFactory({
    endpoint: 'product',
    validEndpoints: ['GET', 'POST', 'DELETE']
});

export const commerceDetailsConsumer = apiConsumerFactory({
    endpoint: 'commerce/{id}',
    validEndpoints: ['GET', 'PATCH']
});

export const categoryDetailsConsumer = apiConsumerFactory({
    endpoint: 'category/{id}',
    validEndpoints: ['GET']
});

export const orderDetailsConsumer = apiConsumerFactory({
    endpoint: 'order/{id}',
    validEndpoints: ['GET', 'POST', 'PATCH']
});

export const productDetailsConsumer = apiConsumerFactory({
    endpoint: 'product/{id}',
    validEndpoints: ['GET', 'POST', 'DELETE']
});

export const storageConsumer = apiConsumerFactory({
    endpoint: 'storage',
    validEndpoints: ['GET', 'POST']
});

export const mercadoPagoConsumer = apiConsumerFactory({
    endpoint: 'checkout/mercadopago',
    validEndpoints: ['POST']
});

export const registerConsumer = apiConsumerFactory({
    endpoint: 'auth/register',
    validEndpoints: ['POST']
});

export const loginConsumer = apiConsumerFactory({
    endpoint: 'auth/login',
    validEndpoints: ['POST']
});

export const userBusinessConsumer = apiConsumerFactory({
    endpoint: 'user/business',
    validEndpoints: ['GET']
});