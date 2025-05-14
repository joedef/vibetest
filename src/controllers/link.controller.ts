import { Request, Response } from 'express';
import { LinkModel } from '../models/link.model';

const linkModel = new LinkModel();

export const getAllLinks = async (req: Request, res: Response) => {
  try {
    const links = await linkModel.findAll();
    res.status(200).json(links);
  } catch (error) {
    console.error('Error getting all links:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLinkById = async (req: Request, res: Response) => {
  try {
    const linkId = parseInt(req.params.id);
    const link = await linkModel.findById(linkId);
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    res.status(200).json(link);
  } catch (error) {
    console.error('Error getting link by id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createLink = async (req: Request, res: Response) => {
  try {
    const bugId = parseInt(req.params.bugId);
    const testCaseId = parseInt(req.params.testCaseId);
    const newLink = await linkModel.create({
      test_case_id: testCaseId,
      bug_id: bugId
    });
    
    res.status(201).json(newLink);
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteLink = async (req: Request, res: Response) => {
  try {
    const linkId = parseInt(req.params.id);
    await linkModel.delete(linkId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateLink = async (req: Request, res: Response) => {
  try {
    const linkId = parseInt(req.params.id);
    const updatedLink = await linkModel.update(linkId, req.body);
    
    if (!updatedLink) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    res.status(200).json(updatedLink);
  } catch (error) {
    console.error('Error updating link:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 