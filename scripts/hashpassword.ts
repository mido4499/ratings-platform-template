import bcrypt from "bcryptjs";

async function main(){
    const password='Admin@Myapp69';
    const hash = await bcrypt.hash(password, 10);
    console.log(hash);
}

main();