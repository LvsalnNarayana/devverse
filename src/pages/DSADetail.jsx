import { useParams } from 'react-router';
import { Alert, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ScrollToTopFab from '../components/ScrollToTopFab';
import DSATopicLayout from '../layouts/DSATopicLayout';
import { useDsaTopicPage } from '../hooks/useDsaTopicPage';

/**
 * DSA topic detail route: /dsa/:id
 *
 * Data flow:
 * 1. Route param `id` matches dsa.js catalog entry (cards on /dsa).
 * 2. dsaRegistry (public/configs/dsa/topic-pages.json) checks if a full page is registered.
 * 3. useDsaTopicPage loads content module + visualization component.
 * 4. DSATopicLayout renders the combined page.
 */
export default function DSADetail() {
  const { id } = useParams();
  const { catalogTopic, pageRef, content, Visualization, loading, error, isRegistered } =
    useDsaTopicPage(id);

  if (!catalogTopic) {
    return (
      <Alert severity="error">
        Topic not found: <strong>{id}</strong>.
        <Button component={RouterLink} to="/dsa" size="small" sx={{ mt: 1, textTransform: 'none' }}>
          Back to DSA list
        </Button>
      </Alert>
    );
  }

  if (loading) {
    return (
      <Stack sx={{ alignItems: 'center', py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (!isRegistered) {
    return (
      <Stack sx={{ gap: 2 }}>
        <Typography variant="h4">{catalogTopic.title}</Typography>
        <Typography color="text.secondary">{catalogTopic.description}</Typography>
        <Alert severity="info">
          Interactive visualization for this topic is not wired yet. Add an entry in{' '}
          <code>public/configs/dsa/topic-pages.json</code> and content under{' '}
          <code>public/configs/dsa/pages/</code>.
        </Alert>
        <Button
          component={RouterLink}
          to="/dsa"
          size="small"
          sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
        >
          Back to topics
        </Button>
        <ScrollToTopFab />
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <DSATopicLayout content={content} Visualization={Visualization} />
      <ScrollToTopFab />
    </>
  );
}
