import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || '';
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as jwt.JwtPayload;
        return decodedToken.id;
    } catch (error) {
        console.error("Error decoding token:", error);
        throw new Error("Unauthorized: Invalid token");
    }

}