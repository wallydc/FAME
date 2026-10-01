<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Devices - Tables</title>

    <!-- Custom fonts for this template -->
    <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link
        href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
        rel="stylesheet">


    <!-- Custom styles for this template -->
    <link href="css/sb-admin-2.css" rel="stylesheet">

    <!-- Custom styles for this page -->
    <link href="vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet">

	  <link rel="stylesheet" href="css/AdminLTE.min.css">
	<!--link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/r/bs-3.3.5/jq-2.1.4,dt-1.10.8/datatables.min.css"/-->
	<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/2.1.8/css/dataTables.dataTables.css"/>
	<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/3.1.2/css/buttons.dataTables.css"/>

	<script type="text/javascript" src="https://cdn.datatables.net/r/bs-3.3.5/jqc-1.11.3,dt-1.10.8/datatables.min.js"></script>

	<style>
        .box_device {
            text-align: center;
            width: 100%;
        }
        .btn.btn-file>input[type='file'] {
            position: relative;
            top: 0;
            right: 0;
            min-width: 100%;
            min-height: 100%;
            font-size: unset;
            text-align: right;
            opacity: unset;
            filter: alpha(opacity = 0);
            outline: none;
            background: none;
            cursor: inherit;
            display: block;
        }
        .btn-primary {
            background-color: unset;
            border-color: unset;
        }
        .btn-primary:hover {
            color: #000000;
            background-color: unset;
            border-color: unset;
        }
        .btn:not(:disabled):not(.disabled) {
            color: #8f919f;
            border: none;
        }
	</style>     

	<script type="text/javascript">
    
    $(document).ready(function() {

      var btnCust = '<button type="button" class="btn btn-secondary" title="Add picture tags" ' + 
          'onclick="alert(\'Call your custom code here.\')">' +
          '<i class="glyphicon glyphicon-tag"></i>' +
          '</button>'; 

      $("#add_uploaded_image").fileinput({
        overwriteInitial: true,
        maxFileSize: 1500,
        showClose: false,
        showCaption: false,
        browseLabel: '',
        removeLabel: '',
        browseIcon: '<i class="glyphicon glyphicon-folder-open"></i>',
        removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
        removeTitle: 'Cancel or reset changes',
        elErrorContainer: '#kv-avatar-errors-1',
        msgErrorClass: 'alert alert-block alert-danger',
        // defaultPreviewContent: '<img src="/uploads/default_avatar_male.jpg" alt="Your Avatar">',
        layoutTemplates: {main2: '{preview} ' +  btnCust + ' {remove} {browse}'},
        allowedFileExtensions: ["jpg", "png", "gif"]
      });

    });

  $(document).ready(function() {
    setTimeout(function() {
      window.location.href='devices.html';
    }, 3000);
  });


    </script>
</head>

<body id="page-top">

    <!-- Page Wrapper -->
    <div id="wrapper">

        <!-- Sidebar -->
        <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled" id="accordionSidebar">

            <!-- Sidebar - Brand -->
            <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html" style="background-color: #fff;">
                <div class="sidebar-brand-icon"><!--  rotate-n-15 -->
                    <!-- <i class="fas fa-laugh-wink"></i> -->
					<img src="img/fame_logo2.png" class="fame_logo" style="margin: 5%;"/>
                </div>
                <div class="sidebar-brand-text mx-3">FAME </div>
            </a>

            <!-- Divider -->
            <hr class="sidebar-divider my-0">

            <!-- Nav Item - Dashboard -->
            <li class="nav-item">
                <a class="nav-link" href="#">
                    <i class="fa-solid fa-map-location-dot"></i>
                    <!-- <span>Map View</span> -->
				        </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">
                    <i class="fa-solid fa-bell"></i>
                    <!-- <span>Notifications</span> -->
				        </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="index.html">
                    <!-- <i class="fa-solid fa-gauge"></i> -->
                    <i class="fa-solid fa-bars-progress"></i>
                    <!-- <span>Dashboard</span> -->
				        </a>
            </li>
            <li class="nav-item active">
                <a class="nav-link" href="#">
                    <!-- <i class="fa-solid fa-mobile"></i> -->
                    <i class="fa-solid fa-satellite-dish"></i>
                    <!-- <span>Devices</span> -->
				        </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">
                    <!-- <i class="fa-sharp fa-solid fa-file-chart-column"></i> -->
					<!-- <i class="fa-sharp fa-regular fa-file-chart-column"></i> -->
                    <i class="fa-solid fa-chart-line"></i>
                    <!-- <span>Reports</span> -->
				        </a>
            </li>
             <li class="nav-item">
                <a class="nav-link" href="#">
                    <i class="fa-solid fa-gear"></i>
                    <!-- <span>Settings</span> -->
				        </a>
            </li>
             <li class="nav-item">
                <a class="nav-link" href="#">
                    <i class="fa-solid fa-circle-question"></i>
                    <!-- <span>Help</span> -->
				        </a>
            </li>
            
            <!-- Nav Item - User Information -->
            <div style="position: relative; margin-top: auto; clear: both;">
                <li class="nav-item dropdown no-arrow" style="border-bottom: none;">
                    <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <!-- <span class="mr-2 d-none d-lg-inline text-gray-600 small">Douglas McGee</span> -->
                        <img class="img-profile rounded-circle"
                            src="img/undraw_profile.svg">
                    </a>
                    <!-- Dropdown - User Information -->
                    <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                        aria-labelledby="userDropdown">
                        <a class="dropdown-item" href="#">
                            <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                            Profile
                        </a>
                        <a class="dropdown-item" href="#">
                            <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                            Settings
                        </a>
                        <a class="dropdown-item" href="#">
                            <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                            Activity Log
                        </a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                            <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Logout
                        </a>
                    </div>
                </li>
            </div>


        </ul>
        <!-- End of Sidebar -->

        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">

          <!-- Main Content -->
          <div id="content">

              <!-- Topbar -->
              <nav class="navbar navbar-expand navbar-light topbar mb-4 static-top">

                  <!-- Sidebar Toggle (Topbar) -->
                  <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                      <i class="fa fa-bars"></i>
                  </button>


              </nav>
              <!-- End of Topbar -->

              <!-- Begin Page Content -->
              <div class="container-fluid">

                <!-- Page Heading -->
                <p class="mb-4">Assets</p>
                <h1 class="h3 mb-2 text-gray-800">Devices</h1>
                

                <!-- Message box -->
                <div class="card shadow mb-4">
                    <div class="card-body">

                      <div class="box">

                        <div class="box-body box_success">

                          <?php

                            $target_dir = "./uploaded_images/";
                            // $target_dir2 = "./uploaded_images/";

                            $target_file = $target_dir . basename($_FILES["add_uploaded_image"]["name"]);
                            $uploadOk = 1;
                            $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

                            // Check if image file is a actual image or fake image
                            if(isset($_POST["submit"])) {
                              $check = getimagesize($_FILES["add_uploaded_image"]["tmp_name"]);
                              if($check !== false) {
                              // echo "File is an image - " . $check["mime"] . ".";
                                $uploadOk = 1;
                              } else {
                                echo "File is not an image.";
                                $uploadOk = 0;
                              }
                            }

                            // Check if file already exists
                            if (file_exists($target_file)) {
                              echo "file overwrite. ";
                              //echo "Sorry, file already exists.";
                              $uploadOk = 0;
                            }

                            // Check file size
                            if ($_FILES["add_uploaded_image"]["size"] > 500000) {
                              echo "Sorry, your file is too large.";
                              $uploadOk = 0;
                            }

                            // Allow certain file formats
                            if($imageFileType != "jpg") {
                              echo "Sorry, only jpg files are allowed.";
                              $uploadOk = 0;
                            }
                            $file_location = $target_dir . strtolower(basename($_FILES["add_uploaded_image"]["name"]));
                            if(isset($_FILES["add_uploaded_image"])){ 

                            if(move_uploaded_file($_FILES["add_uploaded_image"]["tmp_name"], $file_location)){
                              
                              echo "The file ". htmlspecialchars( basename( $_FILES["add_uploaded_image"]["name"])). " has been uploaded.";
                              $uploadOk = 0;
                            };

                            }

 
                            // FOR UPDATE HERE
                            // $target_file_update = $target_dir2 . basename($_FILES["uploaded_image2"]["name"]);
                            // $uploadOk_update = 1;
                            // $imageFileType_update = strtolower(pathinfo($target_file_update,PATHINFO_EXTENSION));

                            // // Check if image file is a actual image or fake image
                            // if(isset($_POST["submit"])) {
                            //   $check_update = getimagesize($_FILES["uploaded_image2"]["tmp_name"]);
                            //   if($check_update !== false) {
                            //   // echo "File is an image - " . $check_update["mime"] . ".";
                            //     $uploadOk_update = 1;
                            //   } else {
                            //     echo "File is not an image.";
                            //     $uploadOk_update = 0;
                            //   }
                            // }

                            // // Check if file already exists
                            // if (file_exists($target_file_update)) {
                            //   echo "file overwrite. ";
                            //   //echo "Sorry, file already exists.";
                            //   $uploadOk_update = 0;
                            // }

                            // // Check file size
                            // if ($_FILES["uploaded_image2"]["size"] > 500000) {
                            //   echo "Sorry, your file is too large.";
                            //   $uploadOk_update = 0;
                            // }

                            // // Allow certain file formats
                            // if($imageFileType_update != "jpg") {
                            //   echo "Sorry, only jpg files are allowed.";
                            //   $uploadOk_update = 0;
                            // }
                            // $file_location_update = $target_dir2 . strtolower(basename($_FILES["uploaded_image2"]["name"]));
                            // if(isset($_FILES["uploaded_image2"])){ 

                            // if(move_uploaded_file($_FILES["uploaded_image2"]["tmp_name"], $file_location_update)){
                              
                            //   echo "The file ". htmlspecialchars( basename( $_FILES["uploaded_image2"]["name"])). " has been uploaded.";
                            //   $uploadOk_update = 0;
                            // };

                            // }




                          ?>
                          
                        </div>
                            <!-- /.box-body -->

                        <!-- /.box-body -->
                      </div>
                      <!-- /.box -->

                    </div>
                </div>

              </div>
              <!-- /.container-fluid -->

          </div>
          <!-- End of Main Content -->

          <!-- Footer -->
          <footer class="sticky-footer bg-white">
              <div class="container my-auto">
                  <div class="copyright text-center my-auto">
                      <span>Copyright &copy; FAME PH 2024</span>
                  </div>
              </div>
          </footer>
          <!-- End of Footer -->

        </div>
        <!-- End of Content Wrapper -->

    </div>
    <!-- End of Page Wrapper -->

    <!-- Scroll to Top Button-->
    <a class="scroll-to-top rounded" href="#page-top">
        <i class="fas fa-angle-up"></i>
    </a>

    <!-- Logout Modal-->
    <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                    <a class="btn btn-primary" href="login.html">Logout</a>
                </div>
            </div>
        </div>
    </div>


    <!-- HERE FOR ADD DEVICE -->
    <div class="modal fade" id="modal_add">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h4 class="modal-title">Add Device</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span></button>
            
            </div>
            <div class="box-body">
            <div class="form-group">
                <label for="add_uploaded_image">Photo</label>
                <div class="kv-avatar">
                    <!-- <div class="file-loading"> -->
                    <div class="">
                        <form action="upload.php" method="post" enctype="multipart/form-data">
                        <input id="add_uploaded_image" class="add_productimage" name="add_uploaded_image" type="file" accept="image/jpg" value="Choose File"><!--  type="file" -->
                        <input type="submit" value="Upload Image" id="upload_images" name="submit" style="display:none">
                    </form>
                    </div>
                    <br/>
                    <div class="box_reminder">
                        <b><span style="color:red">Reminders :</span></b> Please before uploading the image name it same with Identifier and make it sure in jpg format with dimension 512x512
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" class="form-control" id="add_Name" name="Name" placeholder="Name" autocomplete="off"/>
            </div>

            <div class="form-group">
                <label for="identify">Identifier</label>
                <input type="text" class="form-control" id="add_Identifier" name="Identifier" placeholder="Enter Identifier" autocomplete="off" />
            </div>

            <div class="form-group">
                <label for="model">Model</label>
                <input type="text" class="form-control" id="add_Model" name="Model" placeholder="Enter Model" autocomplete="off"/>
            </div>
            
            <div class="form-group">
                <label for="group">Group</label>
                <input type="text" class="form-control" id="add_Group" name="Group" placeholder="Enter Group" autocomplete="off"/>
            </div>
            
            <!-- <div class="form-group">
                <label for="status">Status</label>
                <select id="add_Status" class="form-control" name="add_Status">
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                </select>
            </div> -->
            
            <div class="form-group">
                <label for="contact">Contact Person</label>
                <input type="text" class="form-control" id="add_Contact" name="Contact" placeholder="Enter Contact person" autocomplete="off"/>
            </div>
            

            </div>

            <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-default" onclick="CheckDimension()">Save</button>
            </div>
        </div>
        <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
        
    <!-- HERE FOR EDIT DEVICE -->
    <div class="modal fade" id="modal_edit">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h4 class="modal-title">Add Device</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span></button>
            
            </div>
            <div class="box-body">

                <div class="form-group">
                    <label>Image Preview: </label>
                    <div id="pic_preview">
                    </div>
                  </div>
  
            <div class="form-group">
                <label for="uploaded_image2">Photo</label>
                <div class="kv-avatar">
                    <!-- <div class="file-loading"> -->
                    <div class="">
                        <form action="upload.php" method="post" enctype="multipart/form-data">
                        <input id="uploaded_image2" class="add_productimage" name="uploaded_image2" type="file" accept="image/jpg" value="Choose File"><!--  type="file" -->
                        <input type="submit" value="Upload Image" id="upload_images2" name="submit" style="display:none">
                    </form>
                    </div>
                    <br/>
                    <div class="box_reminder">
                        <b><span style="color:red">Reminders :</span></b> Please before uploading the image name it same with Identifier and make it sure in jpg format with dimension 512x512
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" class="form-control" id="edit_Name" name="Name" placeholder="Name" autocomplete="off"/>
            </div>

            <div class="form-group">
                <label for="identify">Identifier</label>
                <input type="text" class="form-control" id="edit_Identifier" name="Identifier" placeholder="Enter Identifier" autocomplete="off" />
            </div>

            <div class="form-group">
                <label for="model">Model</label>
                <input type="text" class="form-control" id="edit_Model" name="Model" placeholder="Enter Model" autocomplete="off"/>
            </div>
            
            <div class="form-group">
                <label for="group">Group</label>
                <input type="text" class="form-control" id="edit_Group" name="Group" placeholder="Enter Group" autocomplete="off"/>
            </div>
            
            <!-- <div class="form-group">
                <label for="status">Status</label>
                <select id="edit_Status" class="form-control" name="edit_Status">
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                </select>
            </div> -->
            
            <div class="form-group">
                <label for="contact">Contact Person</label>
                <input type="text" class="form-control" id="edit_Contact" name="Contact" placeholder="Enter Contact person" autocomplete="off"/>
            </div>
            

            </div>

            <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-default" onclick="reCheckDimension()">Update</button>
            </div>
        </div>
        <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
        
        
    <!-- Bootstrap core JavaScript-->
    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

    <!-- Core plugin JavaScript-->
    <script src="vendor/jquery-easing/jquery.easing.min.js"></script>

    <!-- Custom scripts for all pages-->
    <script src="js/sb-admin-2.min.js"></script>

    <!-- Page level plugins -->
    <script src="vendor/datatables/jquery.dataTables.min.js"></script>
    <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>

    <!-- Page level custom scripts -->
    <script src="js/demo/datatables-demo.js"></script>
	<script src="https://kit.fontawesome.com/74e07481c2.js" crossorigin="anonymous"></script>

    <script src="js/fileinput.min.js"></script>

    <script type="text/javascript">

	  </script>

	<!-- Bootstrap 3.3.7 -->
	<!-- <script src="dist/js/bootstrap.min.js"></script> -->
	<script src="https://cdn.datatables.net/2.1.8/js/dataTables.js"></script>
	<script src="https://cdn.datatables.net/buttons/3.1.2/js/dataTables.buttons.js"></script>
	<script src="https://cdn.datatables.net/buttons/3.1.2/js/buttons.dataTables.js"></script>
	<script src="https://cdn.datatables.net/buttons/3.1.2/js/buttons.html5.min.js"></script>
</body>

</html>