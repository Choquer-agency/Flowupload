# Flowupload

A file upload widget for Webflow and other websites. Uploads files directly to AWS S3 with presigned URLs.

## Features

- Drag and drop file upload
- Multiple file support
- Progress tracking
- Customizable colors
- Works with any HTML element (div or input)
- Auto-generates short URLs for uploaded files
- Form-friendly (stores URLs in hidden textarea)

## Quick Start

Add this to your HTML:

```html
<script src="https://flowupload.vercel.app/upload-widget.js"></script>

<div flow-upload="widget"></div>
```

## Attributes

| Attribute | Required | Default | Description |
|-----------|----------|---------|-------------|
| `flow-upload="widget"` | Yes | - | Identifies widget containers |
| `flow-button-color` | No | `#2563EB` | Button background color |
| `flow-text-color` | No | `#FFFFFF` | Button text color |
| `flow-name` | No | `uploaded_files` | Form field name for submitted URLs |
| `flow-client` | No | Auto (from domain) | Client ID for file organization |

## Examples

### Basic Usage

```html
<div flow-upload="widget"></div>
```

### Custom Colors

```html
<div flow-upload="widget" 
     flow-button-color="#10B981" 
     flow-text-color="#FFFFFF">
</div>
```

### With Input Element

```html
<input type="file" name="documents" flow-upload="widget">
```

The input's `name` attribute will be used for form submission.

### Custom Form Field Name

```html
<div flow-upload="widget" flow-name="attachments"></div>
```

## Environment Variables (for deployment)

Set these in your Vercel project:

- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- `AWS_REGION` - AWS region (e.g., `us-east-1`)
- `S3_BUCKET_NAME` - Your S3 bucket name

## File Storage

Files are stored in S3 with this structure:

```
{bucket}/{clientId}/{year}/{month}/{day}/{timestamp}-{filename}
```

## License

MIT
