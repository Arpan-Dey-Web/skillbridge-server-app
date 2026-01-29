import { prisma } from "../lib/prisma";
import app from "./app";

const port = process.env.PORT || 5000;

async function main() {
    try {
        await prisma.$connect()
        app.listen(port, () => {
            console.log(`Server Runing on http://localhost:${port}`);
        })
    } catch (error) {
        console.log(error);
        await prisma.$disconnect()
        process.exit(1)
    }
}
main()