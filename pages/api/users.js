import { connection, connectToDatabase, closeDatabaseConnection } from '../../utils/db';

export default async function handler(req, res) {
    try {
        // Connect to the database
        connectToDatabase();

        // Query the list of users
        connection.query('SELECT * FROM tutorials', (error, results) => {
            if (error) {
                console.error('Error querying MySQL:', error);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

            // Close the database connection
            closeDatabaseConnection();

            // Send the list of users as the API response
            res.status(200).json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
