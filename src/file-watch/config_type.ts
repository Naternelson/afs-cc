export type FileWatchConfigType = 
    {
        delimiter: string;
        path: string;
        type: string; // e.g., "notify-pallet-complete"
        fileNameDelimiter: string;
        fileNameFields: Array<{
            name: string;
            type: string;
            required: boolean;
            label: string;
            description: string;
        }>;
        fields: Array<{
            name: string;
            label: string;
            type: string;
            required: boolean;
            enum?: Array<string>;
        }>;
    
}