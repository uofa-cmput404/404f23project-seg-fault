import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import testImage from '../../Images/profile.png';
import EditIcon from '@mui/icons-material/Edit';

// Todo: remove testName afterwards
export default function UserCard({name, imagePath=testImage, isOwner}) {
    const testName = "Selena";
    const menuTemplate = isOwner ? (
        <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
            <Button variant="outlined" color="neutral">
                Post to {name || testName}
            </Button>
            <Button variant="solid" color="primary">
                Follow
            </Button>
        </Box>) : (
        <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
            <Button variant='outlined' color='primary' startIcon={<EditIcon />}>
              Edit
            </Button>
        </Box>);

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        overflow: { xs: 'auto', sm: 'initial' },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          display: 'block',
          width: '1px',
          bgcolor: 'warning.300',
          left: '500px',
          top: '-24px',
          bottom: '-24px',
          '&::before': {
            top: '4px',
            display: 'block',
            position: 'absolute',
            right: '0.5rem',
            color: 'text.tertiary',
            fontSize: 'sm',
            fontWeight: 'lg',
          },
          '&::after': {
            top: '4px',
            display: 'block',
            position: 'absolute',
            left: '0.5rem',
            color: 'text.tertiary',
            fontSize: 'sm',
            fontWeight: 'lg',
          },
        }}
      />
      <Card
        orientation="horizontal"
        sx={{
          width: '100%',
          flexWrap: 'wrap',
          [`& > *`]: {
            '--stack-point': '500px',
            minWidth:
              'clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)',
          },
          overflow: 'auto',
          resize: 'horizontal',
        }}
      >
        <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
          <img
            src={imagePath}
            loading="lazy"
            alt=""
          />
        </AspectRatio>
        <CardContent>
          <Typography fontSize="xl" fontWeight="lg">
            {name || "Selena Gomez"}
          </Typography>
          <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
            @selena
          </Typography>
          {menuTemplate}
          <Sheet
            sx={{
              bgcolor: 'background.level1',
              borderRadius: 'sm',
              p: 1.5,
              my: 1.5,
              display: 'flex',
              gap: 2,
              '& > div': { flex: 1 },
            }}
          >
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Likes
              </Typography>
              <Typography fontWeight="lg">34</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Followers
              </Typography>
              <Typography fontWeight="lg">980</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Posts
              </Typography>
              <Typography fontWeight="lg">12</Typography>
            </div>
          </Sheet>
        </CardContent>
      </Card>
    </Box>
  );
}
