import fetch from 'node-fetch';

interface IXdata {
    status: number;
    statusText: string;
    type: string;
    url: string;
    headers: any;
    data: any;
}

export const invokeAPI = async function (url: string, options: object, output?: string): Promise<IXdata> {
    let endpoint = await fetch(url, options);
    let result = null;
    if (output === 'text') {
        result = await endpoint.text();
    } else {
        result = await endpoint.json();
    };

    let response = {
        status: endpoint.status,
        statusText: endpoint.statusText,
        type: endpoint.type,
        url: endpoint.url,
        headers: endpoint.headers,
        data: result
    }
    return response;
}