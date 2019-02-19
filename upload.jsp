<%@ page import = "java.io.*,java.util.*, javax.servlet.*" %>
<%@ page import = "javax.servlet.http.*" %>
<%@ page import = "org.apache.commons.fileupload.*" %>
<%@ page import = "org.apache.commons.fileupload.disk.*" %>
<%@ page import = "org.apache.commons.fileupload.servlet.*" %>
<%@ page import = "org.apache.commons.io.*" %>

<%
   File file ;
   int maxFileSize = 5000000*1048576;
   int maxMemSize = 5000000 * 1024;
   ServletContext context = pageContext.getServletContext();
   String filePath = context.getInitParameter("file-upload");

   // Verify the content type
   String contentType = request.getContentType();
   
   if (contentType!=null && (contentType.contains("multipart/form-data"))) {
      DiskFileItemFactory factory = new DiskFileItemFactory();
      // maximum size that will be stored in memory
      factory.setSizeThreshold(maxMemSize);
      
      // Location to save data that is larger than maxMemSize.
      factory.setRepository(new File(context.getInitParameter("failed")));

      // Create a new file upload handler
      ServletFileUpload upload = new ServletFileUpload(factory);
      
      // maximum file size to be uploaded.
      upload.setSizeMax( maxFileSize );
      
      try { 
         List fileItems = upload.parseRequest(request);

		  for(Object fileItem : fileItems){
			  FileItem fi = (FileItem) fileItem;
			  if(!fi.isFormField()){
				  // Get the uploaded file parameters
//               String fieldName = fi.getFieldName();
				  String fileName = fi.getName();
//               boolean isInMemory = fi.isInMemory();
//               long sizeInBytes = fi.getSize();

				  String fixedFileName;
				  fixedFileName = fileName.lastIndexOf("\\") >= 0 ? filePath+
						  fileName.substring(fileName.lastIndexOf("\\")) : filePath+
						  fileName.substring(fileName.lastIndexOf("\\")+1);
				  file = new File(fixedFileName);
				  int a = 2;
				  while(file.exists()){
					  String ext = FilenameUtils.getExtension(fixedFileName);
					  String newname = FilenameUtils.removeExtension(fixedFileName)+"_"+a+'.'+ext;
					  file = new File(newname);
					  a++;
				  }
				  fi.write(file);
				  out.println('\''+file.getName()+'\'');
			  }
		  }
      } catch(Exception ex) {
		   System.out.println(ex);
      }
   } else {
      out.println("<html>");
      out.println("<head>");
      out.println("<title>Servlet upload</title>");  
      out.println("</head>");
      out.println("<body>");
      out.println("<p>No file uploaded</p>"); 
      out.println("</body>");
      out.println("</html>");
   }
%>
