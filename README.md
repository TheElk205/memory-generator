# Lebenshilfe Generator

A web application for generating Memory and BINGO cards for Lebenshilfe Kärnten.

## Features

- **Memory Generator**: Create custom memory card pairs with adjustable text sizes
- **BINGO Generator**: Create BINGO cards with customizable fields, text sizes, and field randomization
- Upload custom templates and backgrounds
- Print-ready output in landscape format
- Persistent settings using localStorage

## Docker Deployment

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t lebenshilfe-generator .

# Run the container
docker run -p 3000:3000 lebenshilfe-generator
```

### Using Docker Compose

```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down
```

The application will be available at `http://localhost:3000`

## Development

### Prerequisites

- Node.js 18+
- npm

### Local Development

```bash
cd generator-website
npm install
npm run dev
```

The development server will start at `http://localhost:3000`

### Build for Production

```bash
cd generator-website
npm run build
npm start
```

## Project Structure

```
├── generator-website/          # Next.js application
│   ├── app/                   # App router pages
│   │   ├── page.tsx          # Memory generator
│   │   └── bingo/            # BINGO generator
│   ├── public/               # Static assets (templates, images)
│   └── package.json          # Dependencies
├── Dockerfile                # Docker configuration
├── docker-compose.yml        # Docker Compose setup
└── README.md                 # This file
```

## Usage

1. **Memory Generator**: Create pairs of text cards for memory games
2. **BINGO Generator**: Create BINGO cards with customizable fields and layouts
3. **Advanced Mode**: Access additional features like custom templates and fine-tuning
4. **Print**: Generate print-ready PDFs in A4 landscape format

## License

Created for Lebenshilfe Kärnten