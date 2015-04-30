<?php

error_reporting(0);

if (isset($_POST['data'])) {

  if (!empty($_POST['data']) && strlen($_POST['data']) > 21) {
    if (substr($_POST['data'], 11, 3) == "png") {
      $img = $_POST['data'];
      $img = str_replace('data:image/png;base64,', '', $img);
      $img = str_replace(' ', '+', $img);
      $data = base64_decode($img);
      $filename = file_get_contents('http://www.random.org/integers/?num=1&min=1&max=1000000000&col=1&base=10&format=plain&rnd=new');
      $filename = str_replace(array("\n","\r\n","\r"), '', $filename);
      $filename = $filename.".png";
      $success = file_put_contents("./uploads/".$filename, $data);
      echo ($filename);
    }
  }

}

?>