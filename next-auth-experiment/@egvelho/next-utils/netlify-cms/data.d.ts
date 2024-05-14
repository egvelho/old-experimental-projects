declare type Data<DataType> = {
    id: number;
    slug: string;
    data: DataType;
};
declare type SortFunction<DataType> = (left: Data<DataType>, right: Data<DataType>) => number;
export declare function sortByDate<DataType>(getDate: (data: Data<DataType>) => Date): SortFunction<DataType>;
export declare function getItems<DataType>(inputFolder: string): Promise<Data<DataType>[]>;
export declare function cleanFolder(outputFolder: string, removeFiles: boolean): Promise<void>;
export declare function writeItems<DataType>(outputFolder: string, dataArray: Data<DataType>[]): Promise<void>;
export declare function chunkItems<DataType>(dataArray: Data<DataType>[], pagination: number): Promise<Data<DataType>[][]>;
export declare function writeChunks<DataType>(outputFolder: string, dataChunks: Data<DataType>[][]): Promise<void>;
export declare function removeFilesFromFolder(folder: string): Promise<void>;
export declare function groupBy<DataType>(dataArray: Data<DataType>[], key: keyof DataType): Promise<void>;
export {};
