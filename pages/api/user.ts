import type {NextApiRequest, NextApiResponse} from 'next';
import md5 from 'md5';
import { DefaultResponse } from '../../types/DefaultResponse';
import { UserModel } from '../../models/UserModel';
import { dbConnect} from '../../middlewares/dbConnect';
import { User } from '../../types/User';

const handler = async( req : NextApiRequest, res : NextApiResponse<DefaultResponse>) => {
    try{
        if(req.method !== 'POST' || !req.body){
            return res.status(400).json({ error: 'Metodo informado nao esta disponivel.'});
        }

        const obj : User = req.body;

        if(!obj.name || obj.name.length < 3 || !obj.email || obj.email.length < 6
            || !obj.password || obj.password.length < 4){
            return res.status(400).json({ error: 'Parametros de entrada invalido.'});
        }

        const existingUser = await UserModel.find({ email : obj.email });
        if(existingUser && existingUser.length > 0){
            return res.status(400).json({ error: 'Ja existe usuario com o email informado.'});
        }

        obj.password = md5(obj.password);
        await UserModel.create(obj);
        return res.status(200).json({ message: 'Usuario criado com sucesso.'});
    }catch(e){
        console.log(e);
        res.status(500).json({ error: 'Ocorreu erro ao cadastrar usuario, tente novamente.'});
    }
} 

export default dbConnect(handler);