
// interface to represent unified response for services
export interface ServiceResult<returnedData> {
    data: returnedData;
    message: string
}