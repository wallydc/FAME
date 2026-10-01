# FAME IoT Platform

A web-based IoT platform for monitoring and managing connected devices.

## Overview

The FAME IoT Platform provides a dashboard for viewing and managing IoT devices, device groups, locations, and status information.

## Features

- User login and authentication
- IoT device monitoring
- Device status monitoring
- Online and offline device status
- Device group management
- Device location monitoring
- Interactive map
- Dashboard charts and summary information
- Responsive desktop and mobile interface
- REST API integration

## Technologies Used

- HTML5
- CSS3
- JavaScript
- jQuery
- Bootstrap
- Chart.js
- Mapbox
- Parse
- ThingsBoard REST API

## Dashboard

The dashboard allows users to monitor IoT devices and view important information such as:

- Device name
- Device group
- Device status
- Device location
- Device identifier
- Device information

## Map

The platform includes a map for displaying device locations.

Users can:

- View device markers
- Search for device groups
- Select device locations
- View device information
- Interact with the map

The map functionality uses Mapbox.

## IoT Integration

The platform integrates with IoT services through REST APIs.

### ThingsBoard

ThingsBoard is used for IoT device authentication and device management.

The platform can be used to:

- Authenticate with ThingsBoard
- Create devices
- Manage device information
- Send and retrieve telemetry data

### Parse

Parse is used for application data and device information.

The platform can retrieve information such as:

- Device names
- Device groups
- Device status
- Device identifiers
- Device locations
- Creation dates

## Login

Users must log in with valid credentials to access the dashboard.

The application connects to the configured authentication services during the login process.

## Configuration

The application requires the appropriate API configuration before it can be used.

This may include:

- ThingsBoard server URL
- Parse configuration
- Mapbox access token
- API keys
- Authentication settings

Do not publish passwords, API keys, access tokens, or other sensitive credentials in the repository.

## Responsive Design

The platform is designed to work on:

- Desktop
- Laptop
- Tablet
- Mobile devices

## Troubleshooting

### Login is not working

Check the following:

- Username and password
- Authentication service
- API configuration
- Browser console for errors

### Map is not displaying

Check the following:

- Mapbox access token
- Mapbox library
- Map container size
- Browser console for errors

### Dashboard is not loading

Check the following:

- Internet connection
- API services
- API configuration
- Browser console for JavaScript errors

## Development

The FAME IoT Platform has been customized to provide IoT device monitoring, device management, authentication, mapping, dashboard visualization, and REST API integration.
