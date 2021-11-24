declare module "ronbpost" {
    export interface RONBPost {
        createdAt: Date;
        editedAt: Date | null;
        id: string;
        content: string;
        title: string;
        url: string;
        image: {
            caption: string;
            url: string;
        } | null;
        interactions: {
            likesCount: number;
            commentsCount: number;
            shareCount: number;
            followCount: number;
        };
        author: {
            type: string;
            name: string;
            id: string;
            url: string;
            icon: string;
            website: string;
            createdAt: Date;
        };
    }

    export default function FetchRONBPost(): RONBPost;
}