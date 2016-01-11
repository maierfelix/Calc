<?php

  error_reporting(~0);
  ini_set('display_errors', 1);

  $dir = "../client/";

  $copyright = "/** * This file is part of the Calc project. * * It is permitted to use, redistribute and/or modify this software * under the terms of the BSD License * * @author Felix Maier <maier.felix96@gmail.com> * @copyright (c) 2015 Felix Maier, @felixmaier * * You may not change or remove these lines * */\xA'use strict';";

  $file = fopen($dir."init.js", "r");

  $scriptArray = array();

  $record = false;

  $recordStart = "Import.scripts";
  $recordEnd = "];";

  while(!feof($file)){

    $line = fgets($file);

    if (strpos($line, $recordEnd) !== false) $record = false;

    if ($record === true) {
      if (substr(trim($line), 0, 1) === '"') {
        $line = trim($line);
        $char = substr($line, strlen($line) -1, strlen($line) - 2);
        // Delete first and second 2 characters -> " & ", //
        $value = substr($line, 1, $char === "," ? strlen($line) - 3 : strlen($line) - 2);
        if (substr($value, 0, 4) === "core") {
          $scriptArray[] = $dir.$value;
        }
      }
    }

    if (strpos($line, $recordStart) !== false) $record = true;

  }

  $output = "";

  foreach ($scriptArray as $value) {
    $stream = fopen($value, "r");
    $string = stream_get_contents($stream);
    $output .= $string;
    fclose($stream);
  }

  $compiledFile = fopen("compiled.js", "w") or die("Unable to open file!");
  $output = preg_replace('!/\*.*?\*/!s', '', $output);
  $output = preg_replace('/\n\s*\n/', "\n", $output);
  $output = preg_replace('/"use strict";/', "", $output);
  $output = substr($output, 0, 1) . $copyright . substr($output, 1);
  fwrite($compiledFile, trim($output));
  fclose($compiledFile);

  echo $output;

  fclose($file);

?>