
(function() {
  window.ChoquerUploadWidget = {
    init: function(config) {
      // Make config optional
      config = config || {};
      
      // Support attribute-based selection
      var containers = [];
      
      if (config.containerId) {
        // Old way - ID based (for backward compatibility)
        var element = document.getElementById(config.containerId);
        if (element) containers.push(element);
      } else {
        // New way - attribute based
        containers = Array.from(document.querySelectorAll('[flow-upload="widget"]'));
      }
      
      // If no containers found, show error
      if (containers.length === 0) {
        console.error('ChoquerUploadWidget: No containers found');
        return;
      }
      
      // Initialize each container
      containers.forEach(function(container) {
        if (!container) return;
        
        // Detect element type (input vs div/other)
        var isInputElement = container.tagName.toLowerCase() === 'input';
        
// Find this section (around line 26-27) where clientId is set:
// Get client ID from attribute or config
var clientId = container.getAttribute('flow-client') || (config && config.clientId);


// If no client ID specified or set to 'auto', use the domain name
if (!clientId || clientId === 'auto') {
  // Get domain and clean it up
  var hostname = window.location.hostname;
  
  // Remove common prefixes and suffixes
  clientId = hostname
    .replace('www.', '')          // Remove www
    .replace('.webflow.io', '')   // Remove Webflow staging
    .replace('.com', '')          // Remove .com
    .replace('.ca', '')           // Remove .ca
    .replace('.org', '')          // Remove .org
    .replace('.net', '')          // Remove .net
    .replace('.co', '')           // Remove .co
    .replace(/\./g, '-');         // Replace any remaining dots with dashes
    
  // Make it filesystem safe (only letters, numbers, and dashes)
  clientId = clientId.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

// Fallback to 'default' if still no clientId
clientId = clientId || 'default';

console.log('Using clientId:', clientId); // For debugging

// ADD THE COLOR CUSTOMIZATION HERE - RIGHT AFTER THE clientId SECTION
// Get custom colors from attributes
var buttonColor = container.getAttribute('flow-button-color') || '#2563EB';
var textColor = container.getAttribute('flow-text-color') || '#FFFFFF';

        // Create styles in smaller chunks
        var styles = document.createElement('style');
        var css = '';
        css += '.aws-upload-container { width: 100%; margin: 20px 0; } ';
        css += '.aws-upload-button:disabled { background-color: #9ca3af; cursor: not-allowed; transform: none; } ';
        css += '.upload-info { margin-top: 10px; font-size: 13px; color: #6b7280; line-height: 1.5; } ';
        css += '.file-input-hidden { display: none; } ';
        css += '.upload-status { margin-top: 15px; padding: 12px; background: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 4px; font-size: 14px; color: #1e40af; display: none; } ';
        css += '.upload-status.error { background: #fef2f2; border-color: #ef4444; color: #991b1b; font-weight: 600; padding: 14px; } ';
        css += '.upload-status.success { background: #f0fdf4; border-color: #22c55e; color: #166534; } ';
        css += '.file-list { margin-top: 20px; } ';
        css += '.file-item { display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 10px; transition: all 0.2s; } ';
        css += '.file-item:hover { border-color: #3b82f6; box-shadow: 0 1px 3px rgba(0,0,0,0.1); } ';
        css += '.file-info { display: flex; align-items: center; flex: 1; } ';
        css += '.file-icon { width: 20px; height: 20px; margin-right: 12px; fill: #6b7280; } ';
        css += '.file-name { color: #111827; font-size: 14px; font-weight: 500; } ';
        css += '.file-size { color: #6b7280; font-size: 12px; margin-left: 8px; } ';
        css += '.file-link { color: #3b82f6; text-decoration: none; font-size: 13px; margin-right: 12px; } ';
        css += '.file-link:hover { text-decoration: underline; } ';
        css += '.file-remove { background: none; border: none; color: #ef4444; cursor: pointer; font-size: 20px; padding: 0 8px; } ';
        css += '.file-remove:hover { color: #dc2626; } ';
        css += '.upload-progress { margin-top: 15px; display: none; } ';
        css += '.progress-bar-bg { height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; } ';
        css += '.progress-bar-fill { height: 100%; background: #3b82f6; border-radius: 4px; width: 0%; transition: width 0.3s ease; } ';
        css += '.progress-text { margin-top: 8px; font-size: 13px; color: #6b7280; text-align: center; }';
        css += '.aws-upload-button { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background-color: ' + buttonColor + '; color: ' + textColor + '; border-radius: 8px; font-weight: 500; cursor: pointer; border: none; font-size: 14px; font-family: inherit; transition: all 0.2s; } ';
        css += '.aws-upload-button:hover { background-color: ' + buttonColor + '; filter: brightness(0.9); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); } ';
        css += '.aws-upload-button svg { width: 18px; height: 18px; } ';
        // ADD THESE NEW STYLES FOR DRAG AND DROP
        css += '.upload-drop-zone { padding: 30px; border: 2px dashed #cbd5e1; border-radius: 12px; text-align: center; transition: all 0.3s; background: #fafafa; } ';
        css += '.upload-drop-zone.drag-over { border-color: #2563EB; background: #eff6ff; transform: scale(1.02); } ';
        css += '.drop-zone-text { margin-top: 12px; color: #6b7280; font-size: 14px; } ';
        css += '.upload-drop-zone.drag-over .drop-zone-text { color: #2563EB; font-weight: 500; } ';
        css += '@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } } ';


        styles.textContent = css;
        document.head.appendChild(styles);

        // Create HTML

        // Generate a unique ID for this instance
        var instanceId = Math.random().toString(36).substring(2, 8);

        var html = '<div class="aws-upload-container">';
        html += '<input type="file" id="awsFileInput_' + instanceId + '" class="file-input-hidden" multiple />';

        // NEW: Add drop zone wrapper around button
        html += '<div class="upload-drop-zone" id="dropZone_' + instanceId + '">';
        html += '<button type="button" class="aws-upload-button" id="awsUploadBtn_' + instanceId + '">';
        html += '<svg width="18" height="18" viewBox="470 180 280 320" xmlns="http://www.w3.org/2000/svg">';
        html += '<path d="M718.64,393.19h-50.62c-3.15,25.7-25.09,45.67-51.62,45.67s-48.47-19.97-51.62-45.67h-50.62c-19.02,0-34.44,15.42-34.44,34.44v22.46c0,19.02,15.42,34.44,34.44,34.44h204.48c19.02,0,34.44-15.42,34.44-34.44v-22.46c0-19.02-15.42-34.44-34.44-34.44ZM706.19,453.84c-8.28,0-14.99-6.71-14.99-14.99s6.71-14.99,14.99-14.99,14.99,6.71,14.99,14.99-6.71,14.99-14.99,14.99Z" fill="white"/>';
        html += '<path d="M551.14,293.51c5.37,0,10.75-2.05,14.85-6.15l31.25-31.25v130.72c0,10.59,8.58,19.17,19.17,19.17s19.17-8.58,19.17-19.17v-130.77l31.25,31.25c8.2,8.2,21.5,8.2,29.7,0,8.2-8.2,8.2-21.5,0-29.7l-65.24-65.24c-8.2-8.2-21.5-8.2-29.7,0l-65.29,65.29c-8.2,8.2-8.2,21.5,0,29.7,4.1,4.1,9.47,6.15,14.85,6.15Z" fill="white"/>';
        html += '</svg>';
        html += 'Upload Files';
        html += '</button>';
        html += '<div class="drop-zone-text">or drag and drop files here</div>';
        html += '</div>';

        html += '<div class="upload-info">Max 5MB per file</div>';
        html += '<div class="upload-status" id="uploadStatus_' + instanceId + '"></div>';
        html += '<div class="upload-progress" id="uploadProgress_' + instanceId + '">';
        html += '<div class="progress-bar-bg"><div class="progress-bar-fill" id="progressBar_' + instanceId + '"></div></div>';
        html += '<div class="progress-text" id="progressText_' + instanceId + '">Uploading...</div>';
        html += '</div>';
        html += '<div class="file-list" id="fileList_' + instanceId + '"></div>';
        // Determine upload name: flow-name attribute > input name attribute > default
        var uploadName;
        if (container.getAttribute('flow-name')) {
          uploadName = container.getAttribute('flow-name');
        } else if (isInputElement && container.getAttribute('name')) {
          uploadName = container.getAttribute('name');
        } else {
          uploadName = 'uploaded_files';
        }
        // Remove the instanceId from the name attribute, but keep it in the id for JavaScript to work
        html += '<textarea name="' + uploadName + '" id="uploadedFilesData_' + instanceId + '" style="position: absolute; left: -9999px; width: 1px; height: 1px;"></textarea>';
        html += '</div>';
        
        // Handle widget injection based on element type
        var widgetRoot; // Reference to the element containing widget UI
        
        if (isInputElement) {
          // For input elements: remove original and replace with widget wrapper
          // This prevents accidental form submission of the original input
          var parentElement = container.parentNode;
          var nextSibling = container.nextSibling;
          
          // Create wrapper div
          widgetRoot = document.createElement('div');
          widgetRoot.innerHTML = html;
          widgetRoot.setAttribute('data-initialized', 'true');
          widgetRoot.setAttribute('data-flow-widget', 'true');
          
          // Remove original input and insert widget in its place
          parentElement.removeChild(container);
          if (nextSibling) {
            parentElement.insertBefore(widgetRoot, nextSibling);
          } else {
            parentElement.appendChild(widgetRoot);
          }
        } else {
          // For div/other elements: replace innerHTML (existing behavior)
          container.innerHTML = html;
          container.setAttribute('data-initialized', 'true');
          widgetRoot = container;
        }

        // Initialize variables
        var apiEndpoint = 'https://flowupload.vercel.app/api/get-upload-url';
        var maxFileSize = 5242880;
        var uploadedFiles = [];

        // Use the unique IDs
        var fileInput = document.getElementById('awsFileInput_' + instanceId);
        var uploadBtn = document.getElementById('awsUploadBtn_' + instanceId);
        var fileList = document.getElementById('fileList_' + instanceId);
        var uploadStatus = document.getElementById('uploadStatus_' + instanceId);
        var uploadProgress = document.getElementById('uploadProgress_' + instanceId);
        var progressBar = document.getElementById('progressBar_' + instanceId);
        var progressText = document.getElementById('progressText_' + instanceId);
        var uploadedFilesData = document.getElementById('uploadedFilesData_' + instanceId);
        
        // Format file size
        function formatFileSize(bytes) {
          if (bytes === 0) return '0 Bytes';
          var k = 1024;
          var sizes = ['Bytes', 'KB', 'MB', 'GB'];
          var i = Math.floor(Math.log(bytes) / Math.log(k));
          return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        }
        
        // Show status message
        function showStatus(message, type) {
          type = type || 'info';
          uploadStatus.textContent = message;
          uploadStatus.className = 'upload-status ' + type;
          uploadStatus.style.display = 'block';
          
          if (type === 'success') {
            setTimeout(function() {
              uploadStatus.style.display = 'none';
            }, 5000);
          }
        }
        
       // Upload file to S3
       function uploadFile(file) {
        return new Promise(function(resolve, reject) {
          if (file.size > maxFileSize) {
            // Make the error message clearer
            var maxSizeMB = Math.round(maxFileSize / 1048576);
            var fileSizeMB = (file.size / 1048576).toFixed(1);
            reject(new Error('File "' + file.name + '" is ' + fileSizeMB + 'MB, which exceeds the ' + maxSizeMB + 'MB limit'));
            return;
          }
    
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        clientId: clientId
      })
    })
    .then(function(response) {
      if (!response.ok) throw new Error('Failed to get upload URL');
      return response.json();
    })
    .then(function(data) {
      return fetch(data.uploadURL, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'application/octet-stream'
        },
        body: file
      }).then(function(uploadResponse) {
        if (!uploadResponse.ok) throw new Error('Failed to upload file');
        
        // THIS IS WHERE IT BELONGS - INSIDE THIS FUNCTION!
        var shortId = Math.random().toString(36).substring(2, 8);
        var shortUrl = 'https://flowupload.vercel.app/api/redirect?id=' + shortId;
        
        // Save the mapping
        return fetch('https://flowupload.vercel.app/api/redirect', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            shortId: shortId,
            longUrl: data.downloadURL
          })
        }).then(function() {
          return {
            name: file.name,
            size: file.size,
            url: shortUrl  // Use short URL
          };
        });
      });
    })
    .then(resolve)
    .catch(reject);
  });
}
        
        // Handle file selection
        function handleFiles(files) {
          console.log('handleFiles called with:', files);
          var fileArray = Array.from(files);
          if (fileArray.length === 0) return;
          
          uploadBtn.disabled = true;
          uploadProgress.style.display = 'block';
          
          var completed = 0;
          var total = fileArray.length;
          
          function processNext(index) {
            if (index >= fileArray.length) {
              updateFileList();
              updateHiddenField();
              
              if (completed === total && total > 0) {
                showStatus('Successfully uploaded ' + completed + ' file(s)', 'success');
              } else if (completed === 0) {
                // Don't show generic error - the specific error was already shown
                // Just hide the progress bar
              } else if (completed < total) {
                showStatus('Uploaded ' + completed + ' of ' + total + ' files (some failed)', 'error');
              }
              
              uploadBtn.disabled = false;
              setTimeout(function() {
                uploadProgress.style.display = 'none';
                progressBar.style.width = '0%';
              }, 1000);
              
              fileInput.value = '';
              return;
            }
            
            var file = fileArray[index];
            progressText.textContent = 'Uploading ' + file.name + '...';
            progressBar.style.width = ((completed / total) * 100) + '%';
            
            uploadFile(file)
              .then(function(uploadedFile) {
                uploadedFiles.push(uploadedFile);
                completed++;
                progressBar.style.width = ((completed / total) * 100) + '%';
                processNext(index + 1);
              })
              .catch(function(error) {
                console.error('Upload error:', error);
                
                // Show clearer error message
                if (error.message.includes('exceeds')) {
                  // File size error - make it stand out
                  showStatus('⚠️ ' + error.message, 'error');
                } else {
                  showStatus('Failed to upload ' + file.name + ': ' + error.message, 'error');
                }
                
                // Optional: Add shake animation to button
                uploadBtn.style.animation = 'shake 0.5s';
                setTimeout(function() {
                  uploadBtn.style.animation = '';
                }, 500);
                
                processNext(index + 1);
              });
          }
          
          processNext(0);
        }
        
        // Update file list display
        function updateFileList() {
          fileList.innerHTML = '';
          
          uploadedFiles.forEach(function(file, index) {
            var fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            var html = '<div class="file-info">';
            html += '<svg class="file-icon" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>';
            html += '<span class="file-name">' + file.name + '</span>';
            html += '<span class="file-size">(' + formatFileSize(file.size) + ')</span>';
            html += '</div>';
            html += '<div style="display: flex; align-items: center;">';
            html += '<a href="' + file.url + '" target="_blank" class="file-link">View</a>';
            html += '<button class="file-remove" data-index="' + index + '" type="button">×</button>';
            html += '</div>';
            fileItem.innerHTML = html;
            fileList.appendChild(fileItem);
          });
          
          // Add remove handlers
          var removeButtons = document.querySelectorAll('.file-remove');
          removeButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
              var index = parseInt(this.getAttribute('data-index'));
              uploadedFiles.splice(index, 1);
              updateFileList();
              updateHiddenField();
            });
          });
        }
        
        // Update hidden field
        function updateHiddenField() {
          console.log('Updating hidden field with:', uploadedFiles);
          
          if (uploadedFiles.length === 0) {
            uploadedFilesData.value = '';
            return;
          }
          
          var emailContent = '';
          uploadedFiles.forEach(function(file) {
            emailContent += file.url + '\n';
          });
          
          console.log('Setting textarea value to:', emailContent);
          
          // Try setting it multiple times to make sure it sticks
          uploadedFilesData.value = emailContent.trim();
          
          // Set it again after a tiny delay
          setTimeout(function() {
            uploadedFilesData.value = emailContent.trim();
            console.log('Value after delay:', uploadedFilesData.value);
          }, 100);
          
          // Also try setting it as an attribute
          uploadedFilesData.setAttribute('value', emailContent.trim());
          uploadedFilesData.innerHTML = emailContent.trim();
        }
        
// Event listeners
uploadBtn.addEventListener('click', function() {
  fileInput.click();
});

fileInput.addEventListener('change', function(e) {
  handleFiles(e.target.files);
});

// Add drag and drop functionality
var dropZone = document.getElementById('dropZone_' + instanceId);

if (dropZone) {
  // Prevent default drag behaviors
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(eventName) {
    dropZone.addEventListener(eventName, function(e) {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  });
  
  // Highlight drop area when item is dragged over it
  ['dragenter', 'dragover'].forEach(function(eventName) {
    dropZone.addEventListener(eventName, function() {
      dropZone.classList.add('drag-over');
    }, false);
  });
  
  ['dragleave', 'drop'].forEach(function(eventName) {
    dropZone.addEventListener(eventName, function() {
      dropZone.classList.remove('drag-over');
    }, false);
  });
  
  // Handle dropped files
  dropZone.addEventListener('drop', function(e) {
    console.log('Files dropped:', e.dataTransfer.files);
    var files = e.dataTransfer.files;
    handleFiles(files);
  }, false);
  
  // Make entire drop zone clickable
  dropZone.addEventListener('click', function(e) {
    if (e.target !== uploadBtn && !uploadBtn.contains(e.target)) {
      fileInput.click();
    }
  });
}

});  // THIS CLOSES containers.forEach
}  // THIS CLOSES the init function
};  // THIS CLOSES ChoquerUploadWidget

// Auto-initialize on page load
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', function() {
window.ChoquerUploadWidget.init();
});
} else {
// DOM already loaded
setTimeout(function() {
window.ChoquerUploadWidget.init();
}, 100);
}
})();  // THIS CLOSES the entire IIFE
