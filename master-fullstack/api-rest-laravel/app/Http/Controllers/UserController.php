<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\User;
use App\Helpers\JwtAuth;

class UserController extends Controller
{
    public function pruebas(Request $request){
        return "Accion de pruebas de USER-CONTROLLER";
        
    }
    
    
    
    //Metodo de Registro
    
    public function register(Request $request){
        
        
        // Recoger los datos por post
        $json = $request->input('json', null);
            // Decodificar el json
        $params = json_decode($json); //objeto json con todos los datos recogidos por POST
        $params_array = (array)json_decode($json, true);
        

        //Limpiar datos
        $params_array = array_map('trim', $params_array);
       
        // Validación de los datos
        
        $validate = \Validator::make($params_array, [
           'name'       => 'required|alpha',
           'surname'    => 'required|alpha',
           'email'      => 'required|email|unique:users',
           'password'   => 'required'
            
        ]);
        
        if($validate->fails()){
            //Validacion falla
            $data = array (
                'status'    =>    'error',
                'code'      =>    404,
                'message'   =>    'El usuario no se ha creado correctamente',
                'errors'    =>    $validate->errors()
            );
        }else{
            //Validación pasada correctamente
            
        // Cifrar la contraseña
        $pwd = hash('sha256', $params->password);
        // Comprobar usuario (duplicado)
        
        // Crear el usuario
        $user = new User();
        $user->name = $params_array['name'];
        $user->surname = $params_array['surname'];
        $user->email = $params_array['email'];
        $user->password = $pwd;
        $user->role = 'ROLE_USER';
        //Guardar usuario
        $user->save();
        
        
            $data = array (
                'status'    =>    'success',
                'code'      =>    200,
                'message'   =>    'El usuario se ha creado correctamente',
                'user'      =>    $user
            );
        }       
        

        
        return response()->json($data, $data['code']);
        
    }
    
    
    //Metodo de Login
    
     public function login(Request $request){
        $jwtAuth = new \JwtAuth();
        
        //Recibir el POST con los datos
        $json = $request->input('json', null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);
        
        //Validar los datos
        $validate = \Validator::make($params_array, [
           'email'      => 'required|email',
           'password'   => 'required'
            
        ]);
        
        if($validate->fails()){
            //Validacion falla
            $signup = array (
                'status'    =>    'error',
                'code'      =>    404,
                'message'   =>    'El usuario no se ha logueado correctamente',
                'errors'    =>    $validate->errors()
            );
        }else{
        
        //Cifrar la contraseña
            
            $pwd = hash('sha256', $params->password);
        //Devolver token o datos
            
            $signup = $jwtAuth->signup($params->email, $pwd);
            
            if(!empty($params->gettoken)){
                $signup = $jwtAuth->signup($params->email, $pwd, true);
            }
            
        }
        

     
        return response()->json(($signup), 200);
         
         
    }
    // Metodo de actualizar usuario
    public function update(Request $request){
        
        //Comprobar si el usuario está identificado
        $token = $request->header('Authorization');
        $jwtAuth = new \JwtAuth();
        $checkToken = $jwtAuth->checkToken($token);
        
         // Recoger los datos por POST (Formulario)
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);
        
        if($checkToken && !empty($params_array)){
            // Sacar usuario identificado
            $user = $jwtAuth->checkToken($token, true);
            
            // Validar los datos
            $validate = \Validator::make($params_array, [
                'name'       => 'required|alpha',
                'surname'    => 'required|alpha',
                'email'      => 'required|email|unique:users'.$user->sub,
            ]);
            
            // Quitar los campos que no se quieren actualizar
            unset($params_array['id']);
            unset($params_array['role']);
            unset($params_array['password']);
            unset($params_array['created_at']);
            unset($params_array['remember_token']);
            
            // Actualizar el usuario en bbdd
            
            $user_update = User::where('id', $user->sub)->update($params_array);
            
            // Devolver un array con resultado
            
            $data = array (
                'code'      => 200,
                'status'    => 'success',
                'user'      => $user,
                'changes'   => $params_array
                
            );
        }else{
            $data = array (
                'code'      => 400,
                'status'    => 'error',
                'message'   => 'El usuario no está identificado'
                
                
            );
            
        }
        
        return response()->json($data, $data['code']);
    }
    
    // Metodo para subir imagen de usuario
    
    public function upload(Request $request){
        
        // Recoger datos de peticion
        $image = $request->file('file0');
        // Validación de la imagen
        $validate = \Validator::make($request->all(),[
            'file0'     =>      'required|image|mimes:jpg,jpeg,png,gif'
        ]);
        // Subir y guardar imagen
        
        if(!$image || $validate->fails()){
            $data = array (
                'code'      => 400,
                'status'    => 'error',
                'message'   => 'Error al subir archivo'   
                
            );
            
        }else{
            $image_name = time().$image->getClientOriginalName();
            \Storage::disk('users')->put($image_name, \File::get($image));
        
            $data = array (
                'code'      => 200,
                'status'    => 'success',
                'image'     => $image_name
                
            );

            
        }        
        
        return response()->json($data, $data['code']);
    }
    
    //Obtener la imagen
    
    public function getImage($filename){
        $isset = \Storage::disk('users')->exists($filename);
        if($isset){
            $file = \Storage::disk('users')->get($filename);
            return new Response($file, 200);
        }else{
            $data = array (
                'code'      => 404,
                'status'    => 'error',
                'message'   => 'No existe la imagen'   
                
            );
            return response()->json($data, $data['code']);
        }

    }
    
    //Obtener datos usuario
    
    public function detail($id){
        $user = User::find($id);
        
        if (is_object($user)){
            $data = array (
                'code'      =>  200,
                'status'    => 'success',
                'user'      => $user
                
            );
        }else{
            $data = array (
                'code'      => 404,
                'status'    => 'error',
                'message'   => 'No existe el usuario'   
                
            );
        }
        return response()->json($data, $data['code']);
      
       
    }

    
    
    
    
    
    
    
    
    
    
    
}
