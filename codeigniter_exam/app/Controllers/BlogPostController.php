<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\BlogPostModel;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;
use DateTime;
use stdClass;

class BlogPostController extends BaseController
{

    public function save()
    {
        $validation = Services::validation();
        $validation->setRules([
            'title' => 'required|max_length[50]',
            'content'    => 'required|max_length[500]',
        ]);
        if (!$validation->withRequest($this->request)->run()) {
            return $this->response->setStatusCode(400)->setJSON($validation->getErrors());
        }
        $body = $this->request->getJSON();
        $model = new BlogPostModel();
        $user = json_decode($this->request->getHeaderLine('User'));
        $body->user_id = $user->id;

        $model->save($body);
        $date = new DateTime();
        return $this->response->setJSON(['insertID' => $model->getInsertID(), "created_at" => $date->format('Y-m-d H:i:s')]);
    }

    public function modify($num)
    {
        $body = $this->request->getJSON();
        $model = new BlogPostModel();
        $current = $model->asObject()->find($num);
        if($current === null){
            return $this->response->setStatusCode(422)->setJSON(["error"=>"Not found: $num"]);
        }
        $model->save([
            'id' => $num,
            "title" => $body->title ?? $current->title,
            "content" => $body->content ?? $current->content,
        ]);
        return $this->response->setJSON(['id' => $num]);
    }

    public function delete(int $id){
        $model = new BlogPostModel();
        $model->delete($id);
        return $this->response->setJSON(['rows' => $id]);
    }

    public function all(){
        $model = new BlogPostModel();
        return $this->response->setJSON($model->asArray()->findAll());
    }

    public function get(int $id){
        $model = new BlogPostModel();

        if($model->asArray()->find($id) === null){
            return $this->response->setStatusCode(422)->setJSON(["error"=>"Not found: $id"]);
        }

        return $this->response->setJSON($model->asArray()->find($id));
    }
}
