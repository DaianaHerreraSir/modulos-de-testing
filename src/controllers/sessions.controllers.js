
import { CartDao, UserDao } from "../daos/factory.js";
import { UserDto } from "../dto/userDto.js";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import { generateToken } from "../utils/jsonwebtoken.js";

export class SessionsControllers {
    
        constructor (){
            this.userService = new UserDao()
            this.cartService= new CartDao()
        }


//REGISTRO

register = async(req, res)=>{
    try {
           const{first_name, last_name, email, password}= req.body

const userNew= {
    first_name, 
    last_name,
    email,
    password: createHash(password)
}
const result = await this.userService.createUser(userNew)


const token = generateToken({
    first_name,
    last_name,
    email,
    role,
    cartID,
    id: result._id
})

res.cookie("cookieToken", token,{
    maxAge: 60 * 60 * 1000 *24,
    httpOnly: true
})
 // Redirigir al usuario a la página de inicio de sesión
        res.redirect('/login');
    } catch (error) {
        res.send({status: "error", error })
    }

}


// //LOGIN
login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar las credenciales del usuario
        const user = await this.userService.getUserBy({ email });
        if (!user || !isValidPassword(password, user.password)) {
            return res.status(401).send("Credenciales inválidas");
        }

        // TOKEN único por usuario
        const tokenPayload = {
            _id: user._id,
            email: user.email,
            role: user.role,
            cartID: user.cartID 
        };
        const token = generateToken(tokenPayload);
        req.logger.info("Token del login:", token);

        // Almacenar el token en una cookie
        res.cookie("cookieToken", token, {
            maxAge: 60 * 60 * 1000 * 24, 
            httpOnly: true,
        });

        // Redireccionar al usuario a la página de productos
        res.redirect("/products");
    } catch (error) {
req.logger.error("Error al iniciar sesión:", error);
        res.status(500).send({ status: "error", error });
    }
}

//CURRENT
current = async (req, res) => {
    try {
        const userDto = new UserDto(req.user); 
        res.send({ user: userDto, message: "Información del usuario" });
    } catch (error) {
        res.send({ status: "error", error });
    }
};



//GITHUB

github = async (req, res) => {
    try {
        res.send("aprobado")

    } catch (error) {
        res.send({status: "Error",error})
    } 
    }
    
//GITHUBCALLBACK
githubcallback = async(req, res) => {
    try {
        if (!req.user) {
        
        return res.status(401).json({ status: "error", error: "User not authenticated" });
    }
    const token = generateToken(req.user);
        res.cookie('cookieToken', token, { httpOnly: true });
        res.redirect("/products");
    } catch (error) {
        req.logger.error("Error en githubcallback:", error);
        res.status(500).json({ status: "error", error });
    }
}

}