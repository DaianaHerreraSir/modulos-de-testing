import * as chai from "chai";
import supertest from "supertest";

import { configObject } from "../src/config/connectDB.js";

const expect = chai.expect
const requester = supertest(configObject.mongo_url);

describe("testing del Proyecto", () => {
    describe("test de products", () => {
        it("testing de enpoint POST /products debe crear un producto correctamente", async () => {
            const productMock = {
                title: "Botines grises",
                description: "botines con tacon grises",
                price: 2050,
                thumbnail: "https://inside-sho.com/354799/botines-con-tacon-y-hebilla.webp",
                code: 2344,
                stock: 23,
                status: true,
                category: "botas"
            };

            const resp = await requester.post("/products").send(productMock);

            // Assert response status code
            expect(resp.status).to.equal(200);
            expect(_body.payload.products).to.be.true
        });
        it("testing de enpoint GET /products debe trar todos los productos correctamente", async()=>{
            const{_body, ok, statusCode}= await requester.get("/products")
            expect(ok).to.be.true
            expect(statusCode).to.be.equal(200)
        })

    })
    describe("test avanazado Session", ()=>{
        let cookie
    it("Debe poder registrar un usuario correctamente", async ()=>{
        let userMock ={
            first_name: "Diana",
            last_name: "Sir",
            email: "sirD@gmail.com",
            password: "12345"
        }   
    const {_body} = await requester.post("/api/sessions/register").send(userMock)

    expect(_body.payload).to.be.ok
})

    it("Debe poder loguear un usuario corretamente y devolver una cookies", async ()=>{
        let userMock ={
            email: "sirD@gmail.com",
            password: "12345"
        }
    const response = await requester.post("api/login").send(userMock)
    const cookieResult = response.headers["set-cookie"][0]
    
    expect(cookieResult).to.be.ok
    cookie ={
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1]
}
    expect(cookie.name).to.be.ok.and.equal("codercookie")
    expect(cookie.value).to.be.ok
    })
it("Debe enviar la cookie que contiene el usuarioy destructurar este correctamente", async ()=>{
    const response = (await requester.get("/api/current")).set("Cookie",[ `  ${cookie.name} = ${cookie.value}` ])
    expect(_body.payload.email).to.be.equal("sirD@gmail.com")


    }) 

    
    })

    })    


