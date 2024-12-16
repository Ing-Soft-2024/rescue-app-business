import { userBusinessConsumer } from "../client";

export const getMyBusiness = async (userId: number) => {
    const response = await userBusinessConsumer.consume('GET', {
        queryParams: {
            userId
        }
    });

    console.log(response);
    return response;
}