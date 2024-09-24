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
    validEndpoints: ['GET']
});

export const productConsumer = apiConsumerFactory({
    endpoint: 'product',
    validEndpoints: ['GET', 'POST', 'DELETE']
});

export const commerceDetailsConsumer = apiConsumerFactory({
    endpoint: 'commerce/{id}',
    validEndpoints: ['GET']
});

export const categoryDetailsConsumer = apiConsumerFactory({
    endpoint: 'category/{id}',
    validEndpoints: ['GET']
});

export const orderDetailsConsumer = apiConsumerFactory({
    endpoint: 'order/{id}',
    validEndpoints: ['GET']
});

export const productDetailsConsumer = apiConsumerFactory({
    endpoint: 'product/{id}',
    validEndpoints: ['GET', 'POST', 'DELETE']
});

export const storageConsumer = apiConsumerFactory({
    endpoint: 'storage',
    validEndpoints: ['GET', 'POST']
});